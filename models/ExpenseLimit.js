"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExpenseLimit extends Model {
    static associate(models) {
      ExpenseLimit.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
    }
  }

  ExpenseLimit.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expenseStructure: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalLimit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ExpenseLimit",
      tableName: "expense_limits",
      timestamps: false,
    }
  );
  return ExpenseLimit;
};
