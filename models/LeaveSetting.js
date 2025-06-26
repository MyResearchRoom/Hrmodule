"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LeaveSetting extends Model {
    static associate(models) {}
  }

  LeaveSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      leaveType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noOfDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carryForward: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LeaveSetting",
      tableName: "leave_settings",
      timestamps: false,
    }
  );
  return LeaveSetting;
};
