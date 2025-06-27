"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    static associate(models) {
      Experience.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        as: "employee",
        onDelete: "CASCADE",
      });
    }
  }

  Experience.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      experienceLetter: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Experience",
      tableName: "employee_experiences",

      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );

  Experience.prototype.toJSON = function () {
    const values = { ...this.get() };
    if (values.experienceLetter)
      values.experienceLetter = values.experienceLetter.toString("utf8");
    if (values.from) values.from = values.from.toLocaleDateString();
    if (values.to) values.to = values.to.toLocaleDateString();
    return values;
  };

  return Experience;
};
