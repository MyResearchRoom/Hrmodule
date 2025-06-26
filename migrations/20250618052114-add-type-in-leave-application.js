"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("leave_applications", "type", {
      type: Sequelize.ENUM("paid", "unpaid"),
      allowNull: false,
    });
    await queryInterface.changeColumn("leave_applications", "leaveTypeId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "leave_settings",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("leave_applications", "type");
    await queryInterface.changeColumn("leave_applications", "leaveTypeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "leave_settings",
        key: "id",
      },
    });
  },
};
