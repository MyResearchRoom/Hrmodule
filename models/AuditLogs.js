"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class AuditLog extends Model {
        static associate(models) {
            AuditLog.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
        }
    }
  AuditLog.init( 
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull:true,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endpoint: {
            type: DataTypes.STRING,
        },
        oldData: {
            type: DataTypes.JSON,
            allowNull:true,
        },
        newData: {
            type: DataTypes.JSON,
            allowNull:true,
        },
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "auditlogs",
      timestamps: true,
    }
  );
  return AuditLog;
};