"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payrolls", {
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
      month: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paidDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      earnings: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      deductions: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      totalDeductions: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      grossSalary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      netSalary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("unpaid", "paid"),
        defaultValue: "unpaid",
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      paymentMode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transactionId: {
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
    await queryInterface.dropTable("payrolls");
  },
};
