const express = require('express');
const router = express.Router();

const { addWorkLocation, getWorKLocation, deleteWorkLocation } = require('../controllers/workLocationController');

router.post(
    '/',
    addWorkLocation
),

router.get(
    '/',
    getWorKLocation
),

router.delete(
    '/:id',
    deleteWorkLocation
),

module.exports = router;