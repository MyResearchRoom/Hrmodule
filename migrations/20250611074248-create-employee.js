"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Employees table
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "id",
        },
      },
      designationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "designations",
          key: "id",
        },
      },
      workLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "work_locations",
          key: "id",
        },
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uanNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aadharNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aadharDoc: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      panNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      panDoc: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      profilePicture: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },

      // Present address
      presentAddress: Sequelize.STRING,
      presentCountry: Sequelize.STRING,
      presentState: Sequelize.STRING,
      presentPostalCode: Sequelize.STRING,

      // Permanent address
      permanentAddress: Sequelize.STRING,
      permanentCountry: Sequelize.STRING,
      permanentState: Sequelize.STRING,
      permanentPostalCode: Sequelize.STRING,

      // Professional details
      totalExperience: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastWorkLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastCompanyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastCtc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      relivingLetter: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      additionalInfo: Sequelize.TEXT,

      // Account details
      accountHolderName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifscCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      upiId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      branchName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passbookDoc: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },

      // Employment details
      joiningDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      employeeType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Payroll details
      assignSalaryStructure: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payrollEligibility: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      structure: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      ctc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Education table
    await queryInterface.createTable("employee_educations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      instituteName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      degree: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      completionYear: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      doc: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Experience table
    await queryInterface.createTable("employee_experiences", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jobTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      to: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      experienceLetter: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employee_experiences");
    await queryInterface.dropTable("employee_educations");
    await queryInterface.dropTable("employees");
  },
};
