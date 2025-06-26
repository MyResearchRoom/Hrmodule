const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Payroll extends Model {
    static associate(models) {
      Payroll.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        as: "employee",
      });
    }
  }

  Payroll.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paidDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      earnings: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      deductions: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      totalDeductions: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      grossSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      netSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("unpaid", "paid"),
        defaultValue: "unpaid",
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paymentMode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payroll",
      tableName: "payrolls",
      timestamps: true,
    }
  );

  return Payroll;
};
