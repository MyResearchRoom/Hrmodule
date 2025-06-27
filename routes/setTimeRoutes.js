//final
const express = require('express');
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const { createSetTime, getAllSetTimes, editSetTime, deleteSetTime } = require('../controllers/setTimeController');

router.post(
    '/',
    authenticate(['HR_EMPLOYEE', 'HR_MANAGER']),
    createSetTime
);

router.get(
    '/getAllSetTimes',
    authenticate(['HR_EMPLOYEE', 'HR_MANAGER']),
    getAllSetTimes
);

router.put(
    '/:id',
    authenticate(['HR_EMPLOYEE', 'HR_MANAGER']),
    editSetTime
);

router.delete(
    '/:id',
    authenticate(['HR_EMPLOYEE', 'HR_MANAGER']),
    deleteSetTime
);

module.exports = router;