"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("employees", "structure");
    await queryInterface.createTable("employee_salary_structures", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      earnings: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
      },
      deductions: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
      },
      effectiveFrom: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("employee_salary_structures");
    await queryInterface.addColumn("employees", "structure", {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {},
    });
  },
};
