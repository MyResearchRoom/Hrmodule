const { Op } = require("sequelize");
const {
  User,
  Employee,
  Education,
  Experience,
  Department,
  Role,
  Level,
  WorkLocation,
  Designation,
  SalarySlab,
  EmployeeSalaryStructure,
  sequelize,
} = require("../models");
const bcrypt = require("bcrypt");

exports.hrManagerRegistration = async ({
  name,
  officialEmail,
  mobileNumber,
  password,
  profilePicture,
}) => {
  try {
    const existingUser = await User.findOne({
      where: {
        officialEmail,
      },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      officialEmail,
      mobileNumber,
      password: hashedPassword,
      role: "HR_MANAGER",
      profilePicture,
    });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

exports.employeeRegistration = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      experience,
      education,
      experienceDoc,
      educationDoc,
      name,
      officialEmail,
      mobileNumber,
      password,
      role,
      profilePicture,
      structure,
      ctc,
      ...rest
    } = data;

    const existingUser = await User.findOne(
      {
        where: {
          officialEmail,
        },
      },
      {
        transaction,
      }
    );

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create(
      {
        name,
        officialEmail,
        mobileNumber,
        role,
        password: hashedPassword,
        profilePicture,
      },
      {
        transaction,
      }
    );

    const employee = await Employee.create(
      {
        ...rest,
        ctc,
        userId: user.id,
      },
      {
        transaction,
      }
    );

    await EmployeeSalaryStructure.create(
      {
        employeeId: employee.id,
        earnings: structure.earning,
        deductions: structure.deduction,
        ctc,
        effectiveFrom: new Date(),
      },
      {
        transaction,
      }
    );

    const educationData = education.map((item, index) => {
      const doc = educationDoc[index];
      return {
        ...item,
        doc: `data:${doc.mimetype};base64,${doc.buffer.toString("base64")}`,
        employeeId: employee.id,
      };
    });

    await Education.bulkCreate(educationData, {
      transaction,
    });

    if (experience && experience.length > 0) {
      const experienceData = experience.map((item, index) => {
        const doc = experienceDoc[index];
        return {
          ...item,
          experienceLetter: `data:${doc.mimetype};base64,${doc.buffer.toString(
            "base64"
          )}`,
          employeeId: employee.id,
        };
      });

      await Experience.bulkCreate(experienceData, {
        transaction,
      });
    }

    await transaction.commit();

    return {
      data: {
        name: user.name,
        officialEmail: user.officialEmail,
        mobileNumber: user.mobileNumber,
        profilePicture,
        ...employee.toJSON(),
        structure,
        id: user.id,
        education,
        experience,
      },
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

exports.updateEmployee = async (data) => {
  const {
    employeeId,
    name,
    officialEmail,
    mobileNumber,
    password,
    role,
    profilePicture,
    structure,
    ctc,
    aadharDoc,
    panDoc,
    passbookDoc,
    relivingLetter,
    SalarySlabId,
    ...rest
  } = data;

  const transaction = await sequelize.transaction();
  try {
    const employee = await Employee.findOne({
      where: {
        userId: employeeId,
      },
      transaction,
    });
    if (!employee) {
      if (transaction) await transaction.rollback();
      throw new Error("Employee not found");
    }
    const user = await User.findOne({
      where: {
        id: employee.userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (officialEmail && user.officialEmail !== officialEmail) {
      const existingUser = await User.findOne({
        where: {
          officialEmail,
        },
        transaction,
      });
      if (existingUser) {
        if (transaction) await transaction.rollback();
        throw new Error("Email already exists");
      }
    }

    const userUpdationData = {
      name,
      officialEmail,
      mobileNumber,
    };
    if (password) userUpdationData.password = await bcrypt.hash(password, 10);
    if (profilePicture) userUpdationData.profilePicture = profilePicture;
    else delete user.profilePicture;

    await user.update(userUpdationData, {
      transaction,
    });
    const employeeUpdationData = {
      ...rest,
      SalarySlabId,
      ctc,
    };

    if (aadharDoc) employeeUpdationData.aadharDoc = aadharDoc;
    else delete employeeUpdationData.aadharDoc;
    if (panDoc) employeeUpdationData.panDoc = panDoc;
    else delete employeeUpdationData.panDoc;
    if (passbookDoc) employeeUpdationData.passbookDoc = passbookDoc;
    else delete employeeUpdationData.passbookDoc;
    if (relivingLetter) employeeUpdationData.relivingLetter = relivingLetter;
    else delete employeeUpdationData.relivingLetter;

    await employee.update(employeeUpdationData, {
      transaction,
    });

    const employeeSalaryStructure = await EmployeeSalaryStructure.findOne({
      where: {
        employeeId: employee.id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!employeeSalaryStructure) {
      await EmployeeSalaryStructure.create(
        {
          employeeId: employee.id,
          earnings: structure.earning,
          deductions: structure.deduction,
          ctc,
          effectiveFrom: new Date(),
        },
        {
          transaction,
        }
      );
    } else {
      employeeSalaryStructure.update(
        {
          ctc,
          earnings: structure.earning,
          deductions: structure.deduction,
        },
        {
          transaction,
        }
      );
    }

    await transaction.commit();

    return {
      data: {
        name: user.name,
        officialEmail: user.officialEmail,
        mobileNumber: user.mobileNumber,
        profilePicture,
        ...employeeUpdationData,
        structure,
        id: user.id,
      },
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

exports.getEmployee = async ({ employeeId }) => {
  try {
    const employee = await Employee.findOne({
      where: {
        userId: employeeId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "name",
            "officialEmail",
            "mobileNumber",
            "profilePicture",
          ],
          where: {
            role: {
              [Op.in]: ["EMPLOYEE", "HR_EMPLOYEE"],
            },
          },
          required: true,
        },
        {
          model: Education,
          as: "education",
          attributes: [
            "id",
            "instituteName",
            "degree",
            "specialization",
            "duration",
            "completionYear",
            "grade",
            "doc",
          ],
        },
        {
          model: Experience,
          as: "experience",
          attributes: [
            "id",
            "companyName",
            "jobTitle",
            "from",
            "to",
            "experienceLetter",
          ],
        },
        {
          model: Department,
          as: "department",
        },
        {
          model: Designation,
          as: "designation_",
        },
        {
          model: WorkLocation,
          as: "workLocation_",
        },
        {
          model: Role,
          as: "role",
        },
        {
          model: Level,
          as: "level",
        },
        {
          model: SalarySlab,
          as: "salarySlab",
        },
      ],
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const salaryStructure = await EmployeeSalaryStructure.findOne({
      where: {
        employeeId: employee.id,
      },
      order: [["createdAt", "DESC"]],
    });

    const data = employee.toJSON();

    return {
      ...data,
      ...data.user.toJSON(),
      id: data.userId,
      structure: {
        earning: salaryStructure?.earnings,
        deduction: salaryStructure?.deductions,
      },
      relivingLetter: data.relivingLetter.toString("utf8"),
    };
  } catch (error) {
    throw error;
  }
};

exports.getMe = async ({ employeeId }) => {
  try {
    const user = await User.findOne({ where: { id: employeeId } });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.getHre = async () => {
  return await User.findAll({
    attributes: ["id", "name"],
    where: {
      role: "HR_EMPLOYEE",
    },
    include: {
      model: Employee,
      attributes: [],
      as: "employee",
      where: {
        status: "active",
      },
    },
  });
};

exports.getEmployees = async ({
  departmentId,
  status,
  joiningDate,
  searchTerm,
}) => {
  const whereClause = {};
  if (departmentId) {
    whereClause.departmentId = departmentId;
  }
  if (["active", "inactive"].includes(status)) {
    whereClause.status = status;
  }
  const startDate = new Date(joiningDate).setHours(0, 0, 0, 0);
  const endDate = new Date(joiningDate).setHours(23, 59, 59, 999);
  if (joiningDate) {
    whereClause.joiningDate = {
      [Op.between]: [startDate, endDate],
    };
  }
  if (searchTerm) {
    whereClause["$user.name$"] = {
      [Op.like]: `%${searchTerm}%`,
    };
  }
  const employees = await Employee.findAll({
    where: whereClause,
    attributes: ["id", "joiningDate", "status", "ctc", "userId"],
    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "id",
          "name",
          "role",
          "profilePicture",
          "officialEmail",
          "mobileNumber",
        ],
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

  return employees.map((employee) => ({
    id: employee.userId,
    name: employee.user.name,
    role: employee.user.role,
    status: employee.status,
    profilePicture: employee.user.profilePicture.toString("utf8"),
    designation: employee.designation_.designation,
    department: employee.department.name,
    salary: employee.ctc,
    joiningDate: new Date(employee.joiningDate),
    mobileNumber: employee.user.mobileNumber,
    officialEmail: employee.user.officialEmail,
  }));
};

exports.verifyEmployee = async ({ employeeId, status }) => {
  const employee = await Employee.findOne({
    attributes: ["id", "userId", "status"],
    where: {
      userId: employeeId,
    },
  });
  if (!employee) {
    throw new Error("Employee not found");
  }
  employee.status = status;
  await employee.save();
  return { status };
};

exports.getStats = async () => {
  const [totalCount, activeCount, inActiveCount] = await Promise.all([
    Employee.count(),
    Employee.count({
      where: {
        status: "active",
      },
    }),
    Employee.count({
      where: {
        status: "inactive",
      },
    }),
  ]);

  return {
    totalCount,
    activeCount,
    inActiveCount,
  };
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "User not found or role missing",
      });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["officialEmail", "mobileNumber", "name", "profilePicture"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let department = null;
    let designation = null;

    if (role === "EMPLOYEE") {
      const employee = await Employee.findOne({
        where: { userId },
        include: [
          {
            model: Designation,
            as: "designation_",
            attributes: ["designation"],
          },
          {
            model: Department,
            as: "department",
            attributes: ["name"],
          },
        ],
      });

      if (employee) {
        department = employee.department?.name || null;
        designation = employee.designation_?.designation || null;
      }
    }

    res.status(200).json({
      success: true,
      message: "User info retrieved successfully.",
      data: {
        name: user.name,
        officialEmail: user.officialEmail,
        mobileNumber: user.mobileNumber,
        profilePicture: user.profilePicture.toString("utf8"),
        department,
        designation,
      },
    });
  } catch (error) {
    // console.error("Error retrieving user info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user information.",
    });
  }
};
