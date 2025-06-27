const { HolidaySetting } = require("../models");

exports.getHolidaysDate = async () => {
  try {
    const dates = await HolidaySetting.findAll();
    return dates.map((date) => date.date);
  } catch (error) {
    throw error;
  }
};
