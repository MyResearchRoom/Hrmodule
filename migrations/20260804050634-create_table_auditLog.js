"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("auditlogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      userAgent: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      method: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      endpoint: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      oldData: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      newData: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("auditlogs");
  },
};