"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    static associate(models) {
      Education.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        as: "employee",
        onDelete: "CASCADE",
      });
    }
  }

  Education.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      instituteName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completionYear: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      doc: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Education",
      tableName: "employee_educations",

      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );

  Education.prototype.toJSON = function () {
    const values = { ...this.get() };
    if (values.doc) {
      values.doc = values.doc.toString("utf8");
    }

    return values;
  };

  return Education;
};
