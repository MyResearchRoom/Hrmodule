"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("salary_slabs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      levelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "levels",
          key: "id",
        },
      },
      fromAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      toAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      structure: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("salary_slabs");
  },
};
