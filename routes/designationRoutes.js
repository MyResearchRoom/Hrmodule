const express = require("express");
const {
  addDesignation,
  getDesignation,
  deleteDesignation,
} = require("../controllers/designationController");
const router = express.Router();

router.post("/", addDesignation);

router.get("/", getDesignation);

router.delete("/:id", deleteDesignation);

module.exports = router;
