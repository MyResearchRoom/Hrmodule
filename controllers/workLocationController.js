const { WorkLocation } = require('../models');

exports.addWorkLocation = async (req, res) => {
    try {
        const { location } = req.body;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Please provide a location"
            });
        }

        const newWorkLocation = await WorkLocation.create({ location });

        res.status(201).json({
            success: true,
            message: "WorkLocation created successfully",
            data: newWorkLocation
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Error creating WorkLocation"
        });
    }
}

exports.getWorKLocation = async (req, res) => {
    try {
        const workLocation = await WorkLocation.findAll();
        res.status(200).json({
            success: true,
            message: "WorkLocation retrieved successfully",
            data: workLocation
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Error retrieving WorkLocation"
        });
    }
}

exports.deleteWorkLocation = async (req, res) => {
    try {
        const id = req.params.id;

        const workLocation = await WorkLocation.findByPk(id);
        if (!workLocation) {
            return res.status(404).json({
                success: false,
                message: "WorkLocation not found"
            });
        }

        await workLocation.destroy();

        res.status(200).json({
            success: true,
            message: "WorkLocation deleted successfully"
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Error deleting WorkLocation"
        });
    }
}