"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HolidaySetting extends Model {
    static associate(models) {}
  }

  HolidaySetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      holidayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "HolidaySetting",
      tableName: "holiday_settings",
      timestamps: false,
    }
  );
  return HolidaySetting;
};
