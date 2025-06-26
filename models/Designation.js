"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    static associate(models) {}
  }

  Designation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Designation",
      tableName: "designations",
      timestamps: false,
    }
  );

  return Designation;
};
