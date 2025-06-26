const educationService = require("../services/educationService");

exports.createEducation = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }
    if (req.file.size > 1024 * 1024 * 1) {
      return res
        .status(400)
        .json({ message: "File size should be less than 1 MB" });
    }
    const doc = req.file;
    const education = await educationService.createEducation(
      req.body,
      `data:${doc?.mimetype};base64,${doc?.buffer.toString("base64")}`
    );
    res.status(201).json({
      data: education,
      message: "Education added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getAllEducations = async (req, res) => {
  try {
    const educations = await educationService.getAllEducations({
      employeeId: req.params.employeeId,
    });
    res.status(200).json({ data: educations, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getEducationById = async (req, res) => {
  try {
    const education = await educationService.getEducationById(req.params.id);
    if (!education)
      return res.status(404).json({ message: "Education not found" });
    res.status(200).json({ data: education, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.updateEducation = async (req, res) => {
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
    const doc = req.file;
    const updated = await educationService.updateEducation(
      req.params.id,
      req.body,
      doc
        ? `data:${doc?.mimetype};base64,${doc?.buffer.toString("base64")}`
        : null
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Education not found", success: false });
    res
      .status(200)
      .json({
        message: "Education updated successfully",
        success: true,
        data: updated,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    await educationService.deleteEducation(req.params.id);
    res
      .status(200)
      .json({ message: "Education deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
