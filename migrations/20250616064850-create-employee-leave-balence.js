"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employee_leave_balances", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      leaveTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "leave_settings",
          key: "id",
        },
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      allocated: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      used: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      carriedForward: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      remaining: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employee_leave_balances");
  },
};
