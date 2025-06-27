const { body, check } = require("express-validator");

const hrmValidationRules = [
  check("name")
    .notEmpty()
    .withMessage("Company Name is required.")
    .trim()
    .escape(),

  check("officialEmail")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .normalizeEmail(),

  check("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required.")
    .isNumeric()
    .withMessage("Mobile number must contain only numbers.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits long.")
    .trim(),
];

module.exports = {
  hrmValidationRules,
};
