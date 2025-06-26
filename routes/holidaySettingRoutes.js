const express = require("express");
const router = express.Router();
const {
  addHolidaySetting,
  getHolidaySettingList,
  editHolidaySetting,
  deleteHolidaySetting,
} = require("../controllers/holidaySettingController");

router.post("/", addHolidaySetting);

router.get("/", getHolidaySettingList);

router.put("/:id", editHolidaySetting);

router.delete("/:id", deleteHolidaySetting);

module.exports = router;
