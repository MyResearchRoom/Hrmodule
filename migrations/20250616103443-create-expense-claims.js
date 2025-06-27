'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense_claims', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      claimId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      expenseTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      receipt: {
        type: Sequelize.BLOB('long'),
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM("cash", "online"),
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected", "reimbursed"),
        defaultValue: "pending",
      },
      rejectReason: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('expense_claims');
  }
};
