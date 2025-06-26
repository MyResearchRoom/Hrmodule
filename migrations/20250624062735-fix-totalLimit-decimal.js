"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("expense_limits", "totalLimit", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("expense_limits", "totalLimit", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },
};
