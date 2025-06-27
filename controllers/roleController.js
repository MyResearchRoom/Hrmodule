const { Role } = require("../models");

exports.addRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const addRole = await Role.create({ name });

    res.status(201).json({
      success: true,
      message: "Role added successfully",
      data: addRole,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create level",
    });
  }
};

exports.getRole = async (req, res) => {
  try {
    const role = await Role.findAll();
    res.status(200).json({
      success: true,
      message: "Roles retrieved successfully",
      data: role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve roles",
    });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const id = req.params.id;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await role.destroy();
    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete role",
    });
  }
};
