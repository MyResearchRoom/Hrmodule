const { Router } = require("express");
const {
  login,
  refreshToken,
  logout,
  changePassword,
  changeProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const { validateFiles } = require("../middlewares/fileValidation");
const router = Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.post(
  "/changePassword",
  authenticate(["EMPLOYEE", "HR_EMPLOYEE", "HR_MANAGER"]),
  changePassword
);
router.post("/logout", logout);

router.patch(
  "/updateProfile",
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  validateFiles,
  authenticate(["EMPLOYEE", "HR_EMPLOYEE", "HR_MANAGER"]),
  changeProfile,
)

router.post(
    "/forgot-password",
    forgotPassword,
);

router.post(
    "/reset-password",
    resetPassword
);

module.exports = router;
