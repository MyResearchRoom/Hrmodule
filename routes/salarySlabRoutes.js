const express = require("express");
const router = express.Router();
const {
  addSalarySlab,
  getSalaryStructureList,
  getSalaryStructureById,
  editSalaryStructure,
  deleteSalaryStructure,
  getSalaryStructureByRoleandLevel,
} = require("../controllers/salarySlabController");

router.post("/", addSalarySlab);

router.get("/", getSalaryStructureList);

router.get("/getSalaryStructureById/:id", getSalaryStructureById);

router.get(
  "/getSalaryStructureByRoleandLevel",
  getSalaryStructureByRoleandLevel
);

router.put("/:id", editSalaryStructure);

router.delete("/:id", deleteSalaryStructure);

module.exports = router;
