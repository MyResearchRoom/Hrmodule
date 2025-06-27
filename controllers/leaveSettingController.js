const { where } = require('sequelize');
const { LeaveSetting } = require('../models');

exports.addLeaveSetting = async (req, res) => {
    try {
        const { leaveType, noOfDays, carryForward, description } = req.body

        if (!leaveType || !noOfDays || !carryForward === undefined)
            return res.status(400).json({
                success: false,
                message: "Please fill the required fields"
            })

        const leaveSetting = await LeaveSetting.create({
            leaveType,
            noOfDays,
            carryForward,
            description
        });

        res.status(201).json({
            success: true,
            message: "Leave setting added successfully",
            data: leaveSetting
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to add leave setting"
        })
    }
}

exports.getLeaveSettingsList = async (req, res) => {
    try {

        const leaveSettings = await LeaveSetting.findAll();

        res.status(200).json({
            success: true,
            message: "Leave settings list retrieved succesfully",
            data: leaveSettings
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve leave settings list"
        });
    }
}

exports.editLeaveSetting = async (req, res) => {
    try {
        const { id } = req.params;
        const { leaveType, noOfDays, carryForward, description } = req.body;

        const leaveSetting = await LeaveSetting.findByPk(id);

        if (!leaveSetting) {
            return res.status(404).json({
                success: false,
                message: "Leave setting not found"
            });
        }
        await leaveSetting.update({
            leaveType: leaveType || leaveSetting.leaveType,
            noOfDays: noOfDays || leaveSetting.noOfDays,
            carryForward: carryForward !== undefined ? carryForward : setting.carryForward,
            description: description || leaveSetting.description
        });

        res.status(200).json({
            success: true,
            message: "Leave setting updated successfully",
            data: leaveSetting
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update leave setting"
        });
    }
}

exports.deleteLeaveSetting = async (req, res) => {
    try {
        const { id } = req.params;
        const leaveSetting = await LeaveSetting.findByPk(id);

        if (!leaveSetting) {
            return res.status(404).json({
                success: false,
                message: "Leave Setting not found"
            });
        }
        await LeaveSetting.destroy({ where: { id } });

        res.status(200).json({
            success: true,
            message: "Leave Setting deleted successfully"
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to Delete Leave Setting"
        })
    }
}