const { Router } = require("express");
const {
  leaveRequest,
  actionOnLeaveRequest,
  multipleApproves,
  getLeaves,
  getLeaveBalances,
  getEmployeeLeaveBalances,
  getLeaveById,
  getLeaveStats,
  getEmployeeLeaves,
} = require("../controllers/leaveController");

const authenticate = require("../middlewares/authMiddleware");
const hasPermission = require("../middlewares/hasPermission");
const router = Router();

router.post("/", authenticate(["EMPLOYEE"]), leaveRequest);

router.get(
  "/stats",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  getLeaveStats
);

router.patch(
  "/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  actionOnLeaveRequest
);

router.patch(
  "/multiple/approves",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  multipleApproves
);

router.get(
  "/",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  hasPermission("leave_management"),
  getLeaves
);

router.get("/employee/leaves", authenticate(["EMPLOYEE"]), getEmployeeLeaves);

router.get(
  "/balances/:employeeId",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  getLeaveBalances
);

router.get(
  "/employee/balances",
  authenticate(["EMPLOYEE"]),
  getEmployeeLeaveBalances
);

router.get(
  "/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE", "EMPLOYEE"]),
  getLeaveById
);

module.exports = router;
