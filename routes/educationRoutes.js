const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");
const { upload } = require("../middlewares/upload");
const authenticate = require("../middlewares/authMiddleware");
const hasPermission = require("../middlewares/hasPermission");
const { validateEducation } = require("../validations/education.validator");
const { validate } = require("../middlewares/validations");

router.post(
  "/",
  upload.single("doc"),
  validateEducation,
  validate,
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  educationController.createEducation
);

router.get(
  "/",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  educationController.getAllEducations
);

router.get(
  "/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  educationController.getEducationById
);

router.put(
  "/:id",
  upload.single("doc"),
  validateEducation,
  validate,
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  educationController.updateEducation
);

router.delete(
  "/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  educationController.deleteEducation
);

module.exports = router;
