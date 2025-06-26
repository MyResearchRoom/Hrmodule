const { body } = require("express-validator");

exports.validateEducation = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required")
    .isInt({ min: 1 })
    .withMessage("Employee ID must be a positive integer")
    .toInt(),

  body("instituteName")
    .notEmpty()
    .withMessage("Institute name is required")
    .isString()
    .withMessage("Institute name must be a string")
    .trim()
    .escape(),

  body("degree")
    .notEmpty()
    .withMessage("Degree is required")
    .isString()
    .withMessage("Degree must be a string")
    .trim()
    .escape(),

  body("specialization")
    .notEmpty()
    .withMessage("Specialization is required")
    .isString()
    .withMessage("Specialization must be a string")
    .trim()
    .escape(),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isString()
    .withMessage("Duration must be a string")
    .trim()
    .escape(),

  body("completionYear")
    .notEmpty()
    .withMessage("Completion year is required")
    .isString()
    .withMessage("Completion year must be a string")
    .isLength({ min: 4, max: 4 })
    .withMessage("Completion year must be 4 digits")
    .trim()
    .escape(),

  body("grade")
    .notEmpty()
    .withMessage("Grade is required")
    .isString()
    .withMessage("Grade must be a string")
    .trim()
    .escape(),
];

exports.validateEducationOnUpdate = [
  body("instituteName")
    .notEmpty()
    .withMessage("Institute name is required")
    .isString()
    .withMessage("Institute name must be a string")
    .trim()
    .escape(),

  body("degree")
    .notEmpty()
    .withMessage("Degree is required")
    .isString()
    .withMessage("Degree must be a string")
    .trim()
    .escape(),

  body("specialization")
    .notEmpty()
    .withMessage("Specialization is required")
    .isString()
    .withMessage("Specialization must be a string")
    .trim()
    .escape(),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isString()
    .withMessage("Duration must be a string")
    .trim()
    .escape(),

  body("completionYear")
    .notEmpty()
    .withMessage("Completion year is required")
    .isString()
    .withMessage("Completion year must be a string")
    .isLength({ min: 4, max: 4 })
    .withMessage("Completion year must be 4 digits")
    .trim()
    .escape(),

  body("grade")
    .notEmpty()
    .withMessage("Grade is required")
    .isString()
    .withMessage("Grade must be a string")
    .trim()
    .escape(),
];
