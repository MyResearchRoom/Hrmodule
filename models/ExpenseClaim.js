"use strict"
const { Model } = require('sequelize');
const { generateClaimId } = require('../utils/idGenerator')

module.exports = (sequelize, DataTypes) => {
    class ExpenseClaim extends Model {
        static associate(models) {
            ExpenseClaim.belongsTo(models.Employee, {
                foreignKey: 'employeeId',
                as: 'employee'
            });
        }
    }

    ExpenseClaim.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            claimId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            expenseTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            receipt: {
                type: DataTypes.BLOB("long"),
                allowNull: false,
            },
            paymentMethod: {
                type: DataTypes.ENUM("cash", "online"),
                allowNull: false,
            },
            notes: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("pending", "approved", "rejected", "reimbursed"),
                defaultValue: "pending",
            },
            rejectReason: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: ""
            }
        },
        {
            sequelize,
            modelName: "ExpenseClaim",
            tableName: "expense_claims",
            timestamps: false,
        }
    );

    ExpenseClaim.beforeCreate(async (claim) => {
        claim.claimId = generateClaimId();
    });

    return ExpenseClaim;
};