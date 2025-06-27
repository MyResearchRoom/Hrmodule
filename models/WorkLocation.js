"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkLocation extends Model {
    static associate(models) {}
  }

  WorkLocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "WorkLocation",
      tableName: "work_locations",
      timestamps: false,
    }
  );

  return WorkLocation;
};
