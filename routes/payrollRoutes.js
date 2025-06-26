const express = require("express");
const {
  getPayrollHistory,
  getMonthlyPayrollData,
  getCurrentMonthPayrollData,
  pays,
  getStats,
  getCurrentStats,
  getPayrollDetails,
  getPays,
} = require("../controllers/payrollController");
const authenticate = require("../middlewares/authMiddleware");
const hasPermission = require("../middlewares/hasPermission");
const router = express.Router();

router.get("/", getMonthlyPayrollData);

router.get("/current", getCurrentMonthPayrollData);

router.get("/history/:employeeId", getPayrollHistory);

router.post("/", pays);

router.get("/pays", getPays);

router.get("/month/stats", getStats);

router.get("/current/stats", getCurrentStats);

router.get("/:employeeId", getPayrollDetails);

module.exports = router;
