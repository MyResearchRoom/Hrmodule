const { Level } = require("../models");

exports.addLevel = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Level Name is required",
      });
    }

    const newLevel = await Level.create({ name });

    res.status(201).json({
      success: true,
      message: "Level created successfully",
      data: newLevel,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create level",
    });
  }
};

exports.getLevel = async (req, res) => {
  try {
    const levels = await Level.findAll();
    res.status(200).json({
      success: true,
      message: "Levels retrieved successfully",
      data: levels,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve levels",
    });
  }
};

exports.deleteLevel = async (req, res) => {
  try {
    const { id } = req.params;

    const level = await Level.findByPk(id);
    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    await level.destroy();
    res.status(200).json({
      message: "Level deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete level",
    });
  }
};
