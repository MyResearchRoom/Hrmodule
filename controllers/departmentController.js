const { Department } = require('../models');

exports.addDepartment = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Department Name is required"
            });
        }

        const newDepartment = await Department.create({ name });

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: newDepartment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to create department"
        });
    }
}

exports.getDepartment = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.status(200).json({
            success: true,
            message: "Departments retrieved successfully",
            data: departments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve department"
        });
    }
}

exports.deleteDepartment = async (req, res) => {
    try {
        const id = req.params.id;

        const department = await Department.findByPk(id);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        await department.destroy();

        res.status(200).json({
            message: "Department deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error("Delete Department Error:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
