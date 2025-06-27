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

router.get(
  "/",
  authenticate(["HR_EMPLOYEE", "HR_MANAGER"]),
  getMonthlyPayrollData
);

router.get(
  "/current",
  authenticate(["HR_EMPLOYEE", "HR_MANAGER"]),
  getCurrentMonthPayrollData
);

router.get(
  "/history/:employeeId",
  authenticate(["HR_EMPLOYEE", "HR_MANAGER"]),
  getPayrollHistory
);

router.post("/", authenticate(["HR_EMPLOYEE", "HR_MANAGER"]), pays);

router.get("/pays", authenticate(["HR_EMPLOYEE", "HR_MANAGER"]), getPays);

router.get(
  "/month/stats",
  authenticate(["HR_EMPLOYEE", "HR_MANAGER"]),
  getStats
);

router.get(
  "/current/stats",
  authenticate(["HR_EMPLOYEE", "HR_MANAGER"]),
  getCurrentStats
);

router.get(
  "/:employeeId",
  authenticate(["HR_EMPLOYEE", "HR_MANAGER"]),
  getPayrollDetails
);

module.exports = router;
