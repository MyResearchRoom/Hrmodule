//final
const { SetTime } = require("../models");

exports.createSetTime = async (req, res) => {
  try {
    const { inTime, outTime } = req.body;

    if (!inTime || !outTime) {
      return res.status(400).json({
        success: false,
        message: "Check-in and Check-out time are required.",
      });
    }

    const setTime = await SetTime.create({
      inTime,
      outTime,
    });

    res.status(201).json({
      success: true,
      message: "Check-in and Check-out time added successfully.",
      data: setTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add Check-in and Check-out time.",
    });
  }
};

exports.getAllSetTimes = async (req, res) => {
  try {
    const setTimes = await SetTime.findAll();
    res.status(200).json({
      success: true,
      message: "Set Time List retreived successfully.",
      data: setTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retreive Set Time List.",
    });
  }
};

exports.editSetTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { inTime, outTime } = req.body;

    const setTime = await SetTime.findByPk(id);
    if (!setTime) {
      return res.status(404).json({
        success: false,
        message: "Set Time not found.",
      });
    }
    setTime.inTime = inTime || setTime.inTime;
    setTime.outTime = outTime || setTime.outTime;

    await setTime.save();

    res.status(200).json({
      success: true,
      message: "Set Time updated successfully.",
      data: setTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update Set Time.",
    });
  }
};

exports.deleteSetTime = async (req, res) => {
  try {
    const { id } = req.params;

    const setTime = await SetTime.findByPk(id);
    if (!setTime) {
      return res.status(404).json({
        success: false,
        message: "Set Time not found.",
      });
    }
    await setTime.destroy();

    res.status(200).json({
      success: true,
      message: "Set Time deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete Set Time.",
    });
  }
};
