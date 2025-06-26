const experienceService = require("../services/experienceService");

exports.createExperience = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ message: "Please provide experience letter" });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }
    if (req.file.size > 1024 * 1024 * 1) {
      return res
        .status(400)
        .json({ message: "File size should be less than 1 MB" });
    }
    const experienceLetter = req.file;
    const experience = await experienceService.createExperience(
      req.body,
      `data:${
        experienceLetter?.mimetype
      };base64,${experienceLetter?.buffer.toString("base64")}`
    );
    res.status(201).json({ data: experience, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getAllExperiences = async (req, res) => {
  try {
    const data = await experienceService.getAllExperiences(
      req.params.employeeId
    );
    res.status(200).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getExperienceById = async (req, res) => {
  try {
    const data = await experienceService.getExperienceById(req.params.id);
    if (!data) return res.status(404).json({ message: "Experience not found" });
    res.status(200).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF files are allowed" });
      }
      if (req.file.size > 1024 * 1024 * 1) {
        return res
          .status(400)
          .json({ message: "File size should be less than 1 MB" });
      }
    }
    const experienceLetter = req.file;
    const data = await experienceService.updateExperience(
      req.params.id,
      req.body,
      experienceLetter
        ? `data:${
            experienceLetter?.mimetype
          };base64,${experienceLetter?.buffer.toString("base64")}`
        : null
    );
    if (!data)
      return res
        .status(404)
        .json({ message: "Experience not found", success: false });
    res.status(200).json({
      message: "Experience updated successfully",
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const result = await experienceService.deleteExperience(req.params.id);
    if (!result)
      return res
        .status(404)
        .json({ message: "Experience not found", success: false });
    res
      .status(200)
      .json({ message: "Experience deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
