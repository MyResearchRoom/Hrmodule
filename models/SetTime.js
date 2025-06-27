"use strict";
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class SetTime extends Model {
        static associate(models) { }
    }

    SetTime.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            inTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            outTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "SetTime",
            tableName: "set_times",
            timestamps: false,
        }
    );

    return SetTime;
};
