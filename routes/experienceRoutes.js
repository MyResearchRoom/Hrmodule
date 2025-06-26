const express = require("express");
const router = express.Router();
const experienceController = require("../controllers/experienceController");
const { upload } = require("../middlewares/upload");
const authenticate = require("../middlewares/authMiddleware");
const hasPermission = require("../middlewares/hasPermission");
const { validateExperience } = require("../validations/experience.validator");
const { validate } = require("../middlewares/validations");

router.post(
  "/",
  upload.single("experienceLetter"),
  validateExperience,
  validate,
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  experienceController.createExperience
);

router.get(
  "/",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  experienceController.getAllExperiences
);

router.get(
  "/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  experienceController.getExperienceById
);
router.put(
  "/:id",
  upload.single("experienceLetter"),
  validateExperience,
  validate,
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  experienceController.updateExperience
);
router.delete(
  "/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  experienceController.deleteExperience
);

module.exports = router;
