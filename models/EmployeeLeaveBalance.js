// models/EmployeeLeaveBalance.js
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class EmployeeLeaveBalance extends Model {
    static associate(models) {
      EmployeeLeaveBalance.belongsTo(models.User, {
        foreignKey: "employeeId",
        as: "employee",
      });
      EmployeeLeaveBalance.belongsTo(models.LeaveSetting, {
        foreignKey: "leaveTypeId",
        as: "leaveType",
      });
    }
  }

  EmployeeLeaveBalance.init(
    {
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      leaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      allocated: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      used: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      carriedForward: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      remaining: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "EmployeeLeaveBalance",
      tableName: "employee_leave_balances",
      timestamps: true,
    }
  );

  return EmployeeLeaveBalance;
};
