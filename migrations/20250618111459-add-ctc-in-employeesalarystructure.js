"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("employee_salary_structures", "ctc", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
    await queryInterface.addColumn("employee_salary_structures", "increament", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("employee_salary_structures", "remark", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("employee_salary_structures", "ctc");
    await queryInterface.removeColumn(
      "employee_salary_structures",
      "increament"
    );
    await queryInterface.removeColumn("employee_salary_structures", "remark");
  },
};
