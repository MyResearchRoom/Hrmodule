"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("employees", "roleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    });
    await queryInterface.addColumn("employees", "levelId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "levels",
        key: "id",
      },
    });
    await queryInterface.addColumn("employees", "salarySlabId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "salary_slabs",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("employees", "roleId");
    await queryInterface.removeColumn("employees", "levelId");
    await queryInterface.removeColumn("employees", "salarySlabId");
  },
};
