const { Router } = require("express");
const {
  login,
  refreshToken,
  logout,
  changePassword,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");
const router = Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post(
  "/changePassword",
  authenticate(["EMPLOYEE", "HR_EMPLOYEE", "HR_MANAGER"]),
  changePassword
);
router.post("/logout", logout);

module.exports = router;
