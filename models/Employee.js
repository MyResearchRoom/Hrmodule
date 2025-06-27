"use strict";

const { Model } = require("sequelize");
const {
  encryptSensitiveData,
  decryptSensitiveData,
  getDecryptedDocumentAsBase64,
} = require("../utils/cryptography");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasMany(models.Education, {
        foreignKey: "employeeId",
        as: "education",
        onDelete: "CASCADE",
      });
      Employee.hasMany(models.Experience, {
        foreignKey: "employeeId",
        as: "experience",
        onDelete: "CASCADE",
      });
      Employee.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Employee.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      Employee.belongsTo(models.Level, {
        foreignKey: "levelId",
        as: "level",
      });
      Employee.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "department",
      });
      Employee.belongsTo(models.Designation, {
        foreignKey: "designationId",
        as: "designation_",
      });
      Employee.belongsTo(models.WorkLocation, {
        foreignKey: "workLocationId",
        as: "workLocation_",
      });
      Employee.belongsTo(models.SalarySlab, {
        foreignKey: "salarySlabId",
        as: "salarySlab",
      });
      Employee.hasMany(models.EmployeeSalaryStructure, {
        foreignKey: "employeeId",
        as: "salaryStructure",
      });
    }
  }

  Employee.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      levelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salarySlabId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      designationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uanNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aadharNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aadharDoc: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      panNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      panDoc: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive",
      },

      // Present Address
      presentAddress: DataTypes.STRING,
      presentCountry: DataTypes.STRING,
      presentState: DataTypes.STRING,
      presentPostalCode: DataTypes.STRING,

      // Permanent Address
      permanentAddress: DataTypes.STRING,
      permanentCountry: DataTypes.STRING,
      permanentState: DataTypes.STRING,
      permanentPostalCode: DataTypes.STRING,

      // Professional Details
      totalExperience: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastWorkLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastCompanyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastCtc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      relivingLetter: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      additionalInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // Bank Details
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ifscCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      upiId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branchName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passbookDoc: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },

      // Employment Details
      joiningDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      employeeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // Payroll
      assignSalaryStructure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payrollEligibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      ctc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees",
    }
  );

  const ENCRYPT_FIELDS = [
    "uanNumber",
    "aadharNumber",
    "panNumber",
    "accountNumber",
    "ifscCode",
    "aadharDoc",
    "panDoc",
    "passbookDoc",
  ];

  // Encrypt hook
  Employee.addHook("beforeCreate", (employee) => encryptFields(employee));
  Employee.addHook("beforeUpdate", (employee) => encryptFields(employee));

  function encryptFields(instance) {
    ENCRYPT_FIELDS.forEach((field) => {
      if (instance[field]) {
        instance[field] = encryptSensitiveData(instance[field]);
      }
    });
  }

  Employee.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    ENCRYPT_FIELDS.forEach((field) => {
      if (
        values[field] &&
        [
          "uanNumber",
          "aadharNumber",
          "panNumber",
          "accountNumber",
          "ifscCode",
        ].includes(field)
      ) {
        values[field] = decryptSensitiveData(values[field]);
      } else {
        values[field] = getDecryptedDocumentAsBase64(values[field]);
      }
    });

    delete values.password;
    return values;
  };

  return Employee;
};
