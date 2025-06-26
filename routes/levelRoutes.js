const express = require("express");
const router = express.Router();

const {
  addLevel,
  getLevel,
  deleteLevel,
} = require("../controllers/levelController");

router.post("/", addLevel);
router.get("/", getLevel);
router.delete("/:id", deleteLevel);

module.exports = router;
