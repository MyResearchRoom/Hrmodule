const express = require("express");

const authenticate = require("../middlewares/authMiddleware");
const { getPolicies, addPolicies, editPolicy, getPolicyById, deletePolicy } = require("../controllers/policyController");
const { upload } = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/add-policy",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  upload.fields([
    {
      name: "document",
      maxCount: 1,
    },
  ]),
  addPolicies
);

router.get(
  "/",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE","EMPLOYEE"]),
  getPolicies
);

router.patch(
  "/edit-policy/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  upload.fields([
    {
      name: "document",
      maxCount: 1,
    },
  ]),
  editPolicy
);

router.get(
  "/detailsById/:id",
  authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
  getPolicyById
);

router.delete(
    "/deletePolicy/:id",
    authenticate(["HR_MANAGER", "HR_EMPLOYEE"]),
    deletePolicy
)

module.exports = router;