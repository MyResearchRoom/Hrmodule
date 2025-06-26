'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        employeeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        inTime: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        outTime: {
          type: Sequelize.TIME,
          allowNull: true,
        },
        totalHours: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM("on-time", "late", "over-time", "absent", "half-day", "leave"),
          allowNull: false,
          defaultValue: "on-time",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendances');
  }
};
