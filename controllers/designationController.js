const { Designation } = require('../models');

exports.addDesignation = async (req, res) => {
    try {
        const { designation } = req.body;

        if (!designation) {
            return res.status(400).json({
                success: false,
                message: "Designation Name is required"
            });
        }

        const newDesignation = await Designation.create({ designation });

        res.status(201).json({
            success: true,
            message: "Designation created successfully",
            data: newDesignation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create designation"
        });
    }
}

exports.getDesignation = async (req, res) => {
    try {
        const designations = await Designation.findAll();
        res.status(200).json({
            success: true,
            message: "Designations retrieved successfully",
            data: designations
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve designation"
        });
    }
}

exports.deleteDesignation = async (req, res) => {
    try {
        const id = req.params.id;

        const designation = await Designation.findByPk(id);
        if (!designation) {
            return res.status(404).json({
                success: false,
                message: "Designation not found"
            });
        }

        await designation.destroy();

        res.status(200).json({
            message: "Designation deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}