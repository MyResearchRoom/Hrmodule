const { Op } = require("sequelize");
const {
  User,
  LeaveApplication,
  Employee,
  EmployeeLeaveBalance,
  LeaveSetting,
  HolidaySetting,
  Designation,
  sequelize,
} = require("../models");
const { calculateDaysBetween } = require("../utils/dateHelper");
const { getHolidaysDate } = require("./holidayService");

const getDateOnly = (date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

exports.leaveRequest = async ({
  employeeId,
  leaveTypeId,
  fromDate,
  toDate,
  reason,
}) => {
  const transaction = await sequelize.transaction();
  try {
    // Step 1: Calculate working days per year
    const allYears = new Set();
    const current = new Date(fromDate);
    const end = new Date(toDate);
    while (current <= end) {
      allYears.add(current.getFullYear());
      current.setDate(current.getDate() + 1);
    }

    // Optional: Get holidays and calculate days per year
    const holidays = await HolidaySetting.findAll({
      attributes: ["date"],
    });
    const holidaysSet = new Set(
      holidays.map((h) => h.date.toISOString().split("T")[0])
    );

    const daysByYear = {};
    for (const year of allYears) {
      const start = new Date(
        Math.max(new Date(`${year}-01-01`), new Date(fromDate))
      );
      const finish = new Date(
        Math.min(new Date(`${year}-12-31`), new Date(toDate))
      );
      const days = calculateDaysBetween(start, finish, holidaysSet);
      if (days > 0) daysByYear[year] = days;
    }

    // Step 2: Check or create balances
    const balancesByYear = {};
    for (const year of Object.keys(daysByYear)) {
      let balance = await EmployeeLeaveBalance.findOne({
        where: { employeeId, leaveTypeId, year },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!balance) {
        const leaveType = await LeaveSetting.findOne({
          where: { id: leaveTypeId },
          transaction,
        });
        if (!leaveType) throw new Error("Invalid leave type");

        balance = await EmployeeLeaveBalance.create(
          {
            employeeId,
            leaveTypeId,
            year,
            allocated: leaveType.noOfDays,
            used: 0,
            carriedForward: 0,
            remaining: leaveType.noOfDays,
          },
          { transaction }
        );
      }

      if (balance.remaining < daysByYear[year]) {
        throw new Error(`Insufficient leave balance for year ${year}`);
      }

      balancesByYear[year] = balance;
    }

    // Step 3: Create Leave Application
    const totalDaysRequested = Object.values(daysByYear).reduce(
      (a, b) => a + b,
      0
    );
    const leaveRequest = await LeaveApplication.create(
      {
        employeeId,
        leaveTypeId,
        type: leaveTypeId ? "paid" : "unpaid",
        fromDate,
        toDate,
        daysRequested: totalDaysRequested,
        reason,
        approvedAt: new Date(),
        status: "pending",
      },
      { transaction }
    );

    // Step 4: Deduct from balances
    for (const year of Object.keys(daysByYear)) {
      const balance = balancesByYear[year];
      const days = daysByYear[year];
      await balance.update(
        {
          remaining: balance.remaining - days,
          used: parseFloat(balance.used) + parseFloat(days),
        },
        { transaction }
      );
    }

    await transaction.commit();
    return leaveRequest;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.actionOnLeaveRequest = async ({
  status,
  leaveId,
  rejectionReason,
  approvedBy,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const leaveRequest = await LeaveApplication.findOne({
      where: { id: leaveId },
    });
    if (!leaveRequest) {
      throw new Error("Leave request not found");
    }
    if (leaveRequest.status !== "pending") {
      throw new Error(
        `Leave request status is ${leaveRequest.status}, cannot update`
      );
    }
    if (status === "approved") {
      await leaveRequest.update(
        {
          approvedAt: new Date(),
          status: "approved",
          approvedBy: approvedBy,
        },
        {
          transaction,
        }
      );
    } else if (status === "rejected") {
      await leaveRequest.update(
        {
          status: "rejected",
          rejectionReason: rejectionReason,
        },
        {
          transaction,
        }
      );

      const startDate = getDateOnly(new Date(leaveRequest.fromDate));
      const endDate = getDateOnly(new Date(leaveRequest.toDate));

      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      if (startYear != endYear) {
        const endOfStartYear = new Date(Date.UTC(startYear, 11, 31)); // 31st Dec
        const startOfEndYear = new Date(Date.UTC(endYear, 0, 1)); // 1st Jan

        const holidaysDate = await getHolidaysDate();

        const daysInStartYear = calculateDaysBetween(
          startDate,
          endOfStartYear,
          new Set(holidaysDate)
        );
        const daysInEndYear = calculateDaysBetween(
          startOfEndYear,
          endDate,
          new Set(holidaysDate)
        );

        const leaveBalanceStartYear = await EmployeeLeaveBalance.findOne({
          where: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year: startYear,
          },
        });

        await leaveBalanceStartYear.update(
          {
            remaining:
              parseFloat(leaveBalanceStartYear.remaining) +
              parseFloat(daysInStartYear),
            used: leaveBalanceStartYear.used - daysInStartYear,
          },
          { transaction }
        );

        // Update for end year
        const leaveBalanceEndYear = await EmployeeLeaveBalance.findOne({
          where: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year: endYear,
          },
        });

        await leaveBalanceEndYear.update(
          {
            remaining:
              parseFloat(leaveBalanceEndYear.remaining) +
              parseFloat(daysInEndYear),
            used: leaveBalanceEndYear.used - daysInEndYear,
          },
          { transaction }
        );
      } else {
        const employeeLeaveBalance = await EmployeeLeaveBalance.findOne({
          where: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year: startYear,
          },
        });

        await employeeLeaveBalance.update(
          {
            remaining:
              parseFloat(employeeLeaveBalance.remaining) +
              parseFloat(leaveRequest.daysRequested),
            used: employeeLeaveBalance.used - leaveRequest.daysRequested,
          },
          {
            transaction,
          }
        );
      }
    }

    await transaction.commit();

    return leaveRequest;
  } catch (error) {
    throw error;
  }
};

exports.multipleApproves = async ({ leaveIds, approvedBy }) => {
  try {
    const requests = await LeaveApplication.update(
      {
        status: "approved",
        approvedAt: new Date(),
        approvedBy,
      },
      {
        where: {
          id: {
            [Op.in]: leaveIds,
          },
        },
      }
    );
    return requests;
  } catch (error) {
    throw error;
  }
};

exports.getLeaves = async ({
  page,
  limit,
  searchTerm,
  status,
  fromDate,
  toDate,
  leaveTypeId,
  employeeId,
  scope,
}) => {
  try {
    const offset = (page - 1) * limit;
    const whereClause = {};
    if (["pending", "approved", "rejected"].includes(status)) {
      whereClause.status = status;
    }
    if (searchTerm) {
      whereClause[Op.or] = [
        { employeeId: { [Op.like]: `%${searchTerm}%` } },
        { "$employee.name$": { [Op.like]: `%${searchTerm}%` } },
      ];
    }
    if (fromDate) {
      whereClause.fromDate = { [Op.gte]: fromDate };
    }
    if (toDate) {
      whereClause.toDate = { [Op.lte]: toDate };
    }
    if (leaveTypeId) {
      whereClause.leaveTypeId = leaveTypeId;
    }
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }
    if (scope === "past") {
      whereClause.toDate = { [Op.lte]: new Date() };
    } else if (scope === "future") {
      whereClause.fromDate = { [Op.gte]: new Date() };
    }

    const { count, rows } = await LeaveApplication.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "employeeId",
        "fromDate",
        "toDate",
        "status",
        "reason",
        "daysRequested",
        "leaveTypeId",
        "type",
        "reason",
        "createdAt",
      ],
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name"],
        },
        {
          model: LeaveSetting,
          as: "leaveType",
          attributes: ["id", "leaveType"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    const data = rows.map((leave) => ({
      id: leave.id,
      employeeId: leave.employeeId,
      fromDate: new Date(leave.fromDate).toLocaleDateString(),
      toDate: new Date(leave.toDate).toLocaleDateString(),
      reason: leave.reason,
      totalDays: leave.daysRequested,
      requestedOn: new Date(leave.createdAt).toLocaleDateString(),
      status: leave.status,
      employeeId: leave.employeeId,
      name: leave.employee.name,
      leaveType: leave.leaveType.leaveType,
      type: leave.type,
    }));

    return {
      data,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        page: page,
        limit: limit,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getLeaveBalances = async ({ employeeId, year }) => {
  try {
    const employee = await Employee.findOne({
      where: {
        userId: employeeId,
      },
      attributes: ["id", "userId"],
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
    const leaveTypes = await LeaveSetting.findAll({
      attributes: ["id", "leaveType", "description", "noOfDays"],
    });

    const balances = await EmployeeLeaveBalance.findAll({
      where: { employeeId, year },
    });

    const balanceMap = new Map();
    for (const balance of balances) {
      balanceMap.set(balance.leaveTypeId, balance);
    }

    const result = leaveTypes.map((lt) => {
      const balance = balanceMap.get(lt.id);
      return {
        leaveTypeId: lt.id,
        leaveName: lt.leaveType,
        description: lt.description,
        allocated: balance ? balance.allocated : lt.noOfDays,
        used: balance ? balance.used : 0,
        remaining: balance ? balance.remaining : lt.noOfDays,
      };
    });

    return {
      name: employee.user.name,
      profilePicture: employee.user.profilePicture.toString("utf8"),
      designation: employee.designation_.designation,
      leaveBalances: result,
    };
  } catch (error) {
    throw error;
  }
};

exports.getLeaveById = async ({ leaveId }) => {
  try {
    const leave = await LeaveApplication.findOne({
      where: { id: leaveId },
      include: {
        model: LeaveSetting,
        as: "leaveType",
        attributes: ["id", "leaveType"],
      },
    });
    return {
      id: leave.id,
      employeeId: leave.employeeId,
      fromDate: new Date(leave.fromDate).toLocaleDateString(),
      toDate: new Date(leave.toDate).toLocaleDateString(),
      totalDays: leave.daysRequested,
      status: leave.status,
      reason: leave.reason,
      rejectionReason: leave.rejectionReason,
      leaveType: leave.leaveType?.leaveType || "Unknown",
      type: leave.type,
    };
  } catch (error) {
    throw error;
  }
};

exports.getLeaveStats = async () => {
  try {
    const [
      totalEmployeeCount,
      totalLeaveCount,
      totalPendingLeaveCount,
      totalApprovedLeaveCount,
      totalRejectedLeaveCount,
    ] = await Promise.all([
      User.count(),
      LeaveApplication.count(),
      LeaveApplication.count({ where: { status: "pending" } }),
      LeaveApplication.count({ where: { status: "approved" } }),
      LeaveApplication.count({ where: { status: "rejected" } }),
    ]);

    return {
      totalEmployeeCount,
      totalLeaveCount,
      totalPendingLeaveCount,
      totalApprovedLeaveCount,
      totalRejectedLeaveCount,
    };
  } catch (error) {
    throw error;
  }
};
