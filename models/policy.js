"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Policy extends Model {
    static associate(models) {

    }
  }
   Policy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      document: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
       documentContentType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Policy",
      tableName: "policies",
      timestamps: true,
    }
  );

   return Policy;
};