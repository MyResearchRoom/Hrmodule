"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profilePicture", {
      type: Sequelize.BLOB("long"),
      allowNull: false,
    });
    await queryInterface.removeColumn("employees", "profilePicture");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("employees", "profilePicture", {
      type: Sequelize.BLOB("long"),
      allowNull: false,
    });
    await queryInterface.removeColumn("users", "profilePicture");
  },
};
