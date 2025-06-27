const express = require('express');
const router = express.Router();
const { addExpenseLimit, getExpenseLimitList, editExpenseLimit, deleteExpenseLimit } = require('../controllers/expenseLimitController');

router.post(
    '/',
    addExpenseLimit
);

router.get(
    '/',
    getExpenseLimitList
);

router.put(
    '/:id',
    editExpenseLimit
);

router.delete(
    '/:id',
    deleteExpenseLimit
);

module.exports = router;