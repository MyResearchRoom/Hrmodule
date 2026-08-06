const express = require("express");

const authenticate = require("../middlewares/authMiddleware");
const { getAuditLogs } = require("../controllers/auditController");

const router = express.Router();

router.get(
  "/",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  getAuditLogs
);

module.exports = router;