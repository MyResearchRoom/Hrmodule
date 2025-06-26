const express = require("express");
const router = express.Router();

const { addDepartment, getDepartment, deleteDepartment } = require("../controllers/departmentController");

router.post(
    '/',
    addDepartment
);

router.get(
    '/',
    getDepartment
);

router.delete(
    '/:id',
    deleteDepartment
);

module.exports = router;