'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leave_settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      leaveType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      noOfDays: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      carryForward: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leave_settings');
  }
};
