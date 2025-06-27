// models/LeaveApplication.js
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class LeaveApplication extends Model {
    static associate(models) {
      LeaveApplication.belongsTo(models.User, {
        foreignKey: "employeeId",
        as: "employee",
      });
      LeaveApplication.belongsTo(models.LeaveSetting, {
        foreignKey: "leaveTypeId",
        as: "leaveType",
      });
    }
  }

  LeaveApplication.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      leaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("paid", "unpaid"),
        allowNull: false,
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      daysRequested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      reason: {
        type: DataTypes.STRING,
      },
      rejectionReason: {
        type: DataTypes.STRING,
      },
      approvedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LeaveApplication",
      tableName: "leave_applications",
      timestamps: true,
    }
  );

  return LeaveApplication;
};
