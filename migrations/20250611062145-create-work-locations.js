'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_locations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('work_locations');
  }
};
