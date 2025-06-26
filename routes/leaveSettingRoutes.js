const express = require("express");
const router = express.Router();
const {
  addLeaveSetting,
  getLeaveSettingsList,
  editLeaveSetting,
  deleteLeaveSetting,
} = require("../controllers/leaveSettingController");

router.post("/", addLeaveSetting);
router.get("/", getLeaveSettingsList);
router.put("/:id", editLeaveSetting);
router.delete("/:id", deleteLeaveSetting);

module.exports = router;
