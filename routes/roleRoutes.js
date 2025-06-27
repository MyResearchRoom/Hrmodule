const express = require("express");
const router = express.Router();

const { addRole, getRole, deleteRole } = require("../controllers/roleController");

router.post(
    '/',
    addRole
);

router.get(
    '/',
    getRole
);

router.delete(
    '/:id',
    deleteRole
);


module.exports = router;