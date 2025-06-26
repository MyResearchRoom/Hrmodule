const { body } = require("express-validator");

exports.validateExperience = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required")
    .isInt({ min: 1 })
    .withMessage("Employee ID must be a positive integer")
    .toInt(),

  body("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isString()
    .withMessage("Company name must be a string")
    .trim()
    .escape(),

  body("jobTitle")
    .notEmpty()
    .withMessage("Job title is required")
    .isString()
    .withMessage("Job title must be a string")
    .trim()
    .escape(),

  body("from")
    .notEmpty()
    .withMessage("From date is required")
    .isISO8601()
    .withMessage("From date must be a valid date")
    .toDate(),

  body("to")
    .notEmpty()
    .withMessage("To date is required")
    .isISO8601()
    .withMessage("To date must be a valid date")
    .toDate(),
];
