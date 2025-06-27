const moment = require("moment");
const {
  Employee,
  User,
  Designation,
  Department,
  EmployeeSalaryStructure,
  Payroll,
  Attendance,
  LeaveApplication,
  LeaveSetting,
} = require("../models");
const { getHolidaysDate } = require("./holidayService");
const { calculateDaysBetween, getDate } = require("../utils/dateHelper");
const { Op } = require("sequelize");
const { decryptSensitiveData } = require("../utils/cryptography");

// --------------------------------- payroll mqanagement service ---------------------------------
exports.getMonthlyPayrollData = async ({
  month,
  departmentId,
  status,
  searchTerm,
}) => {
  if (month && moment().format("YYYY-MM") < month) {
    throw new Error("Data is not available for selected month");
  }
  try {
    const startDate = moment(month).startOf("month").format("YYYY-MM-DD");
    const endDate = moment(month).endOf("month").format("YYYY-MM-DD");
    const holidaysSet = await getHolidaysDate();
    const totalDaysInMonth = calculateDaysBetween(
      startDate,
      endDate,
      new Set(holidaysSet)
    );
    const whereClause = {
      status: "active",
    };
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
    if (searchTerm && searchTerm.trim() !== "") {
      whereClause["$user.name$"] = { [Op.like]: `%${searchTerm}%` };
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "profilePicture"],
        },
        {
          model: Department,
          as: "department",
        },
        {
          model: Designation,
          as: "designation_",
        },
      ],
    });

    const results = [];

    for (const employee of employees) {
      const attendances = await Attendance.findAll({
        where: {
          employeeId: employee.id,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const presentDays = attendances.filter((a) =>
        ["on-time", "late", "over-time", "half-day"].includes(a.status)
      ).length;

      const approvedLeaves = await LeaveApplication.findAll({
        where: {
          employeeId: employee.userId,
          status: "approved",
          fromDate: { [Op.lte]: endDate },
          toDate: { [Op.gte]: startDate },
        },
        include: {
          model: LeaveSetting,
          as: "leaveType",
        },
      });

      let paidLeaveDays = 0;
      for (const leave of approvedLeaves) {
        const leaveStart = moment.max(
          moment(leave.fromDate),
          moment(startDate)
        );
        const leaveEnd = moment.min(moment(leave.toDate), moment(endDate));
        const days = calculateDaysBetween(
          leaveStart,
          leaveEnd,
          new Set(holidaysSet)
        );

        if (leave.type === "paid") {
          paidLeaveDays += days;
        }
      }

      const payableDays = presentDays + paidLeaveDays;

      const salaryStructure = await EmployeeSalaryStructure.findOne({
        where: {
          employeeId: employee.id,
        },
        order: [["createdAt", "DESC"]],
      });

      let earning = 0,
        deduction = 0;
      for (const component of salaryStructure.earnings) {
        earning += parseFloat(component.amount, 10);
      }
      for (const component of salaryStructure.deductions) {
        deduction += parseFloat(component.amount, 10);
      }
      const perDaySalary = (earning - deduction) / totalDaysInMonth;
      const netSalary = payableDays * perDaySalary;

      const payrollExists = await Payroll.findOne({
        where: {
          employeeId: employee.id,
          month,
        },
      });

      if (["paid", "unpaid"].includes(status)) {
        if (payrollExists && status === "paid") {
          results.push({
            payableDays,
            employeeId: employee.userId,
            employeeName: employee.user.name,
            profilePicture: employee.user.profilePicture.toString("utf8"),
            designation: employee.designation_.designation,
            department: employee.department.name,
            netSalary: Math.round(netSalary),
            status: payrollExists ? payrollExists.status : "unpaid",
          });
        } else if (!payrollExists && status === "unpaid") {
          results.push({
            payableDays,
            employeeId: employee.userId,
            employeeName: employee.user.name,
            profilePicture: employee.user.profilePicture.toString("utf8"),
            designation: employee.designation_.designation,
            department: employee.department.name,
            netSalary: Math.round(netSalary),
            status: payrollExists ? payrollExists.status : "unpaid",
          });
        }
      } else {
        results.push({
          employeeId: employee.userId,
          employeeName: employee.user.name,
          payableDays,
          profilePicture: employee.user.profilePicture.toString("utf8"),
          designation: employee.designation_.designation,
          department: employee.department.name,
          netSalary: Math.round(netSalary),
          status: payrollExists ? payrollExists.status : "unpaid",
        });
      }
    }

    return results.filter((result) => result !== null);
  } catch (error) {
    throw error;
  }
};

exports.getPayrollDetails = async ({ employeeId }) => {
  const employee = await Employee.findOne({
    where: {
      userId: employeeId,
      status: "active",
    },
    attributes: [
      "id",
      "userId",
      "joiningDate",
      "paymentMethod",
      "accountHolderName",
      "bankName",
      "accountNumber",
      "ifscCode",
      "ctc",
      "status",
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "profilePicture"],
      },
      {
        model: Designation,
        as: "designation_",
      },
      {
        model: Department,
        as: "department",
      },
    ],
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const structure = await EmployeeSalaryStructure.findOne({
    where: {
      employeeId: employee.id,
    },
    order: [["createdAt", "DESC"]],
  });

  const earnings = structure.earnings.reduce(
    (earnings, comp) => earnings + parseFloat(comp.amount),
    0
  );
  const deductions = structure.deductions.reduce(
    (deductions, comp) => deductions + parseFloat(comp.amount),
    0
  );

  const payrollHistory = await Payroll.findAll({
    where: {
      employeeId: employee.id,
    },
    attributes: [
      "month",
      "netSalary",
      "paymentMode",
      "transactionId",
      "paidAt",
      "status",
    ],
    order: [["createdAt", "DESC"]],
  });

  return {
    id: employee.userId,
    name: employee.user.name,
    status: employee.status,
    profilePicture: employee.user.profilePicture?.toString("utf8"),
    designation: employee.designation_.designation,
    department: employee.department.name,
    joiningDate: new Date(employee.joiningDate).toLocaleDateString(),
    ctc: employee.ctc,
    grossSalary: Math.round(earnings),
    deductions,
    netSalary: Math.round(earnings - deductions),
    paymentMethod: employee.paymentMethod,
    accountHolderName: employee.accountHolderName,
    bankName: employee.bankName,
    accountNumber: decryptSensitiveData(employee.accountNumber),
    ifscCode: decryptSensitiveData(employee.ifscCode),
    structure: {
      earning: structure.earnings,
      deduction: structure.deductions,
    },
    payrollHistory: payrollHistory.map((payroll) => ({
      month: payroll.month,
      netSalary: payroll.netSalary,
      paymentMode: payroll.paymentMode,
      transactionId: payroll.transactionId,
      paymentDate: new Date(payroll.paidAt).toLocaleDateString(),
      status: payroll.status,
    })),
  };
};

exports.getPayrollHistory = async ({ employeeId }) => {
  const employee = await Employee.findOne({
    where: {
      userId: employeeId,
    },
    attributes: ["id", "userId", "joiningDate", "ctc"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "profilePicture"],
      },
      {
        model: Designation,
        as: "designation_",
      },
    ],
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const salaryStructures = await EmployeeSalaryStructure.findAll({
    where: {
      employeeId: employee.id,
    },
    order: [["createdAt", "DESC"]],
  });

  if (!salaryStructures) {
    throw new Error("No salary structures found");
  }

  const data = salaryStructures.map((structure) => {
    const earnings = structure.earnings.reduce(
      (earnings, comp) => earnings + parseFloat(comp.amount),
      0
    );
    const deductions = structure.deductions.reduce(
      (deductions, comp) => deductions + parseFloat(comp.amount),
      0
    );
    return {
      year: new Date(structure.createdAt).getFullYear(),
      ctc: structure.ctc,
      grossSalary: Math.round(earnings),
      deductions: Math.round(deductions),
      netSalary: Math.round(earnings - deductions),
      increament: structure.increament,
      remark: structure.remark,
      details: {
        earning: structure.earnings,
        deduction: structure.deductions,
      },
    };
  });

  return {
    id: employee.userId,
    employee: {
      id: employee.userId,
      name: employee.user.name,
      profilePicture: employee.user.profilePicture.toString("utf8"),
      designation_: employee.designation_,
      joiningDate: new Date(employee.joiningDate).toLocaleDateString(),
      ctc: employee.ctc,
    },
    history: data,
  };
};

// --------------------------------- payruns service ---------------------------------
exports.getCurrentMonthPayrollData = async ({
  departmentId,
  status,
  month,
  searchTerm,
}) => {
  try {
    if (month && moment().format("YYYY-MM") < month) {
      throw new Error("Data is not available for selected month");
    }
    let today, startDate, endDate;

    if (month && moment().format("YYYY-MM") > month) {
      today = moment(month, "YYYY-MM");
      startDate = today.startOf("month").format("YYYY-MM-DD");
      endDate = today.endOf("month").format("YYYY-MM-DD");
    } else {
      today = moment();
      endDate = today.format("YYYY-MM-DD");
      startDate = today.startOf("month").format("YYYY-MM-DD");
    }

    const holidaysSet = await getHolidaysDate();
    const totalDaysInMonth = calculateDaysBetween(
      startDate,
      today.endOf("month").format("YYYY-MM-DD"),
      new Set(holidaysSet)
    );

    const whereClause = {
      status: "active"
    };
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
    if (searchTerm && searchTerm.trim() !== "") {
      whereClause["$user.name$"] = { [Op.like]: `%${searchTerm}%` };
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    });

    const results = [];

    for (const employee of employees) {
      const attendances = await Attendance.findAll({
        where: {
          employeeId: employee.id,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const presentDays = attendances.filter((a) =>
        ["on-time", "late", "over-time", "half-day"].includes(a.status)
      ).length;

      const approvedLeaves = await LeaveApplication.findAll({
        where: {
          employeeId: employee.userId,
          status: "approved",
          fromDate: { [Op.lte]: endDate },
          toDate: { [Op.gte]: startDate },
        },
        include: {
          model: LeaveSetting,
          as: "leaveType",
        },
      });

      let paidLeaveDays = 0;
      for (const leave of approvedLeaves) {
        const leaveStart = moment.max(
          moment(leave.fromDate),
          moment(startDate)
        );
        const leaveEnd = moment.min(moment(leave.toDate), moment(endDate));
        const days = calculateDaysBetween(
          leaveStart,
          leaveEnd,
          new Set(holidaysSet)
        );

        if (leave.type === "paid") {
          paidLeaveDays += days;
        }
      }

      const payableDays = presentDays + paidLeaveDays;
      const salaryStructure = await EmployeeSalaryStructure.findOne({
        where: {
          employeeId: employee.id,
        },
        order: [["createdAt", "DESC"]],
      });

      let earning = 0,
        deduction = 0;
      for (const component of salaryStructure.earnings) {
        earning += parseFloat(component.amount, 10);
      }
      for (const component of salaryStructure.deductions) {
        deduction += parseFloat(component.amount, 10);
      }

      const perDayGross = earning / totalDaysInMonth;
      const perDayEarning = (earning - deduction) / totalDaysInMonth;
      const perDayDeduction = deduction / totalDaysInMonth;

      const payrollExists = await Payroll.findOne({
        where: {
          employeeId: employee.id,
          month,
        },
      });

      if (["paid", "unpaid"].includes(status)) {
        if (payrollExists && status === "paid") {
          results.push({
            employeeId: employee.userId,
            employeeName: employee.user.name,
            payableDays,
            grossSalary: Math.round(perDayGross * payableDays),
            deductions: Math.round(perDayDeduction * payableDays),
            netSalary: Math.round(perDayEarning * payableDays),
            // structure: {
            //   earning: salaryStructure.earnings,
            //   deduction: salaryStructure.deductions,
            // },
            status: "paid",
          });
        } else if (!payrollExists && status === "unpaid") {
          results.push({
            employeeId: employee.userId,
            employeeName: employee.user.name,
            payableDays,
            grossSalary: Math.round(perDayGross * payableDays),
            deductions: Math.round(perDayDeduction * payableDays),
            netSalary: Math.round(perDayEarning * payableDays),
            // structure: {
            //   earning: salaryStructure.earnings,
            //   deduction: salaryStructure.deductions,
            // },
            status: "unpaid",
          });
        }
      } else {
        results.push({
          employeeId: employee.userId,
          employeeName: employee.user.name,
          payableDays,
          grossSalary: Math.round(perDayGross * payableDays),
          deductions: Math.round(perDayDeduction * payableDays),
          netSalary: Math.round(perDayEarning * payableDays),
          // structure: {
          //   earning: salaryStructure.earnings,
          //   deduction: salaryStructure.deductions,
          // },
          status: payrollExists ? payrollExists.status : "unpaid",
        });
      }
    }

    return results;
  } catch (error) {
    throw error;
  }
};

// --------------------------------- pay service ---------------------------------

const getPayrollData = async ({ employeeIds, month }) => {
  try {
    const startDate = moment(month, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(month, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");
    const holidaysSet = await getHolidaysDate();

    const totalDaysInMonth = calculateDaysBetween(
      startDate,
      endDate,
      new Set(holidaysSet)
    );

    const whereClause = {
      status: "active",
    };
    if (employeeIds && employeeIds.length > 0) {
      whereClause.userId = {
        [Op.in]: employeeIds,
      };
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
    });

    const results = [];

    for (const employee of employees) {
      const attendances = await Attendance.findAll({
        where: {
          employeeId: employee.id,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const presentDays = attendances.filter((a) =>
        ["on-time", "late", "over-time", "half-day"].includes(a.status)
      ).length;

      const approvedLeaves = await LeaveApplication.findAll({
        where: {
          employeeId: employee.id,
          status: "approved",
          fromDate: { [Op.lte]: endDate },
          toDate: { [Op.gte]: startDate },
        },
        include: {
          model: LeaveSetting,
          as: "leaveType",
        },
      });

      let paidLeaveDays = 0;
      for (const leave of approvedLeaves) {
        const leaveStart = moment.max(
          moment(leave.fromDate),
          moment(startDate)
        );
        const leaveEnd = moment.min(moment(leave.toDate), moment(endDate));
        const days = calculateDaysBetween(
          leaveStart,
          leaveEnd,
          new Set(holidaysSet)
        );

        if (leave.type === "paid") {
          paidLeaveDays += days;
        }
      }

      const payableDays = presentDays + paidLeaveDays;
      const salaryStructure = await EmployeeSalaryStructure.findOne({
        where: {
          employeeId: employee.id,
        },
        order: [["createdAt", "DESC"]],
      });

      let earning = 0,
        deduction = 0;
      for (const component of salaryStructure.earnings) {
        earning += parseFloat(component.amount);
      }
      for (const component of salaryStructure.deductions) {
        deduction += parseFloat(component.amount);
      }
      const perDayEarning = (earning - deduction) / totalDaysInMonth;
      const perDayDeduction = deduction / totalDaysInMonth;

      // return structure with required updates
      let earnings = salaryStructure.earnings;
      if (totalDaysInMonth !== payableDays) {
        earnings = earnings.map((earning) => {
          if (earning.earningName === "Baisc") {
            return {
              ...earning,
              amount:
                (parseFloat(earning.amount) / totalDaysInMonth) * payableDays,
            };
          }
          return earning;
        });
      }

      salaryStructure.earnings = earnings;

      const payrollExists = await Payroll.findOne({
        where: {
          employeeId: employee.id,
          month,
        },
      });

      const shouldAddPayroll =
        !payrollExists || payrollExists.status === "unpaid";

      if (shouldAddPayroll) {
        results.push({
          employeeId: employee.id,
          employeeName: employee.user.name,
          payableDays,
          grossSalary: (earning / totalDaysInMonth) * payableDays,
          deductions: Math.round(perDayDeduction * payableDays),
          netSalary: Math.round(perDayEarning * payableDays),
          structure: {
            earning: salaryStructure.earnings,
            deduction: salaryStructure.deductions,
          },
        });
      }
    }

    return results;
  } catch (error) {
    throw error;
  }
};

exports.pays = async ({ month, employeeIds }) => {
  const existingPayrolls = await Payroll.findAll({
    where: {
      month,
      employeeId: {
        [Op.in]: employeeIds,
      },
    },
  });
  const paidEmployeeIds = existingPayrolls.map((payroll) => payroll.employeeId);
  const unpaidEmployeeIds = employeeIds.filter(
    (employeeId) => !paidEmployeeIds.includes(employeeId)
  );
  const result = await getPayrollData({
    employeeIds: unpaidEmployeeIds,
    month,
    status: "unpaid",
  });
  const data = result.map((item) => {
    return {
      employeeId: item.employeeId,
      month,
      paidDays: item.payableDays,
      earnings: item.structure.earning,
      deductions: item.structure.deduction,
      totalDeductions: item.deductions,
      grossSalary: item.grossSalary,
      netSalary: item.netSalary,
      status: "paid",
      paidAt: new Date(),
      paymentMode: "bank-transfer",
      transactionId: `TXN-${moment().format("YYYYMMDDHHmmss")}-${
        item.employeeId
      }`,
    };
  });
  const payrolls = await Payroll.bulkCreate(data);

  return payrolls;
};

exports.getPays = async ({ month }) => {
  const pays = await Payroll.findAll({
    where: {
      month,
      status: "paid",
    },
    include: [
      {
        model: Employee,
        as: "employee",
        attributes: ["id", "userId"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return pays.map((pay) => ({
    employeeId: pay.employee.userId,
    employeeName: pay.employee.user.name,
    paidDays: pay.paidDays,
    month: pay.month,
    paymentDate: new Date(pay.paidAt).toLocaleDateString(),
    structure: {
      earning: pay.earnings,
      deduction: pay.deductions,
    },
    netSalary: pay.netSalary,
    paymentMode: pay.paymentMode,
    transactionId: pay.transactionId,
  }));
};

exports.getStats = async ({ month }) => {
  const [totalEmployees, processedPays] = await Promise.all([
    Employee.count({
      where: {
        status: "active",
      },
    }),
    Payroll.count({
      where: {
        month,
        status: "paid",
      },
    }),
  ]);

  return {
    totalEmployees: totalEmployees,
    processedPays: processedPays,
    pendingPays: totalEmployees - processedPays,
    month: month,
  };
};

exports.getCurrentStats = async ({ month }) => {
  const targetMonth =
    month && moment(month, "YYYY-MM", true).isValid()
      ? moment(month, "YYYY-MM")
      : moment();

  const formattedMonth = targetMonth.format("YYYY-MM");

  const payrollData = await getPayrollData({
    employeeIds: [],
    month: formattedMonth,
  });

  const totalGrossSalary = payrollData.reduce(
    (acc, curr) => acc + curr.grossSalary,
    0
  );
  const totalDeductions = payrollData.reduce(
    (acc, curr) => acc + curr.deductions,
    0
  );
  const totalNetSalary = payrollData.reduce(
    (acc, curr) => acc + curr.netSalary,
    0
  );

  return {
    month: formattedMonth,
    totalGrossSalary: Math.round(totalGrossSalary || 0),
    totalNetSalary: Math.round(totalNetSalary || 0),
    totalDeductions: Math.round(totalDeductions || 0),
  };
};
