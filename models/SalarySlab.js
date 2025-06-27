"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SalarySlab extends Model {
    static associate(models) {
      SalarySlab.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      SalarySlab.belongsTo(models.Level, {
        foreignKey: "levelId",
        as: "level",
      });
    }
  }

  SalarySlab.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      levelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fromAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      toAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      structure: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SalarySlab",
      tableName: "salary_slabs",
      timestamps: true,
    }
  );

  return SalarySlab;
};
