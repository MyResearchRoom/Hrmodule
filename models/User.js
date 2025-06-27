"use strict";
const { Model } = require("sequelize");
const { generateUserId } = require("../utils/idGenerator");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Employee, {
        foreignKey: "userId",
        as: "employee",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      officialEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("HR_MANAGER", "HR_EMPLOYEE", "EMPLOYEE"),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  User.beforeCreate((user) => {
    user.id = generateUserId(user.role);
  });

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    if (values.profilePicture) {
      values.profilePicture = values.profilePicture.toString("utf8"); // or "utf8"
    }
    return values;
  };

  return User;
};
