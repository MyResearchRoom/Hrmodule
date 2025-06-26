const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class EmployeeSalaryStructure extends Model {
    static associate(models) {
      EmployeeSalaryStructure.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        as: "employee",
      });
    }
  }

  EmployeeSalaryStructure.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ctc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      earnings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      deductions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      increament: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      effectiveFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "EmployeeSalaryStructure",
      tableName: "employee_salary_structures",
      timestamps: true,
    }
  );

  return EmployeeSalaryStructure;
};
