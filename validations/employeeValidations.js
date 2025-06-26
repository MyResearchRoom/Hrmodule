const { body } = require("express-validator");

exports.employeeValidationRules = [
  body("departmentId")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .trim()
    .escape(),

  body("roleId")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .trim()
    .escape(),

  body("levelId")
    .notEmpty()
    .withMessage("Level is required")
    .isString()
    .trim()
    .escape(),

  body("designationId")
    .notEmpty()
    .withMessage("Designation is required")
    .isString()
    .trim()
    .escape(),
  body("workLocationId")
    .notEmpty()
    .withMessage("Work location is required")
    .isString()
    .trim()
    .escape(),

  body("name")
    .notEmpty()
    .withMessage("Company Name is required.")
    .trim()
    .escape(),

  body("officialEmail")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .normalizeEmail(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required.")
    .isNumeric()
    .withMessage("Mobile number must contain only numbers.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits long.")
    .trim(),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("uanNumber")
    .notEmpty()
    .withMessage("UAN Number is required")
    .isLength({ min: 12, max: 12 })
    .withMessage("UAN must be 12 digits")
    .isNumeric()
    .withMessage("UAN must be numeric"),

  body("aadharNumber")
    .notEmpty()
    .withMessage("Aadhaar Number is required")
    .matches(/^[2-9]{1}[0-9]{11}$/)
    .withMessage("Invalid Aadhaar Number"),

  body("panNumber")
    .notEmpty()
    .withMessage("PAN Number is required")
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
    .withMessage("Invalid PAN format")
    .toUpperCase(),

  body("accountHolderName")
    .notEmpty()
    .withMessage("Account holder name is required")
    .isString()
    .trim()
    .escape(),

  body("bankName")
    .notEmpty()
    .withMessage("Bank name is required")
    .isString()
    .trim()
    .escape(),

  body("accountNumber")
    .notEmpty()
    .withMessage("Account number is required")
    .isNumeric()
    .withMessage("Account number must be numeric"),

  body("ifscCode")
    .notEmpty()
    .withMessage("IFSC Code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage("Invalid IFSC code")
    .toUpperCase(),

  body("upiId")
    .notEmpty()
    .withMessage("UPI ID is required")
    .matches(/^[\w.-]+@[\w]+$/)
    .withMessage("Invalid UPI ID")
    .trim(),

  body("branchName")
    .notEmpty()
    .withMessage("Branch name is required")
    .isString()
    .trim()
    .escape(),

  body("joiningDate")
    .notEmpty()
    .withMessage("Joining date is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date"),

  body("employeeType")
    .notEmpty()
    .withMessage("Employee type is required")
    .isString()
    .trim()
    .escape(),

  body("assignSalaryStructure")
    .notEmpty()
    .withMessage("Assign salary structure is required")
    .isString()
    .trim()
    .escape(),

  body("payrollEligibility")
    .notEmpty()
    .withMessage("Payroll eligibility is required")
    .isBoolean()
    .withMessage("Must be boolean"),

  body("structure").notEmpty().withMessage("Salary structure is required"),
  // .isObject()
  // .withMessage("Structure is invalid"),

  body("ctc")
    .notEmpty()
    .withMessage("CTC is required")
    .isNumeric()
    .withMessage("CTC must be numeric"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isString()
    .trim()
    .escape(),

  body("totalExperience")
    .notEmpty()
    .withMessage("Total experience is required")
    .isString()
    .trim()
    .escape(),

  body("lastWorkLocation")
    .notEmpty()
    .withMessage("Last work location is required")
    .isString()
    .trim()
    .escape(),

  body("lastCompanyName")
    .notEmpty()
    .withMessage("Last company name is required")
    .isString()
    .trim()
    .escape(),

  body("lastCtc")
    .notEmpty()
    .withMessage("Last CTC is required")
    .isString()
    .trim(),

  // body("experience").isArray({ min: 1 }).withMessage("Experience is required"),
  // body("experience.*.companyName")
  //   .notEmpty()
  //   .withMessage("Experience: company name is required")
  //   .isString()
  //   .trim()
  //   .escape(),
  // body("experience.*.jobTitle")
  //   .notEmpty()
  //   .withMessage("Experience: job title is required")
  //   .isString()
  //   .trim()
  //   .escape(),
  // body("experience.*.from")
  //   .notEmpty()
  //   .withMessage("Experience: from date is required")
  //   .isISO8601()
  //   .toDate(),
  // body("experience.*.to")
  //   .notEmpty()
  //   .withMessage("Experience: to date is required")
  //   .isISO8601()
  //   .toDate(),

  body("education").isArray({ min: 1 }).withMessage("Education is required"),
  body("education.*.instituteName")
    .notEmpty()
    .withMessage("Education: institute name is required")
    .isString()
    .trim()
    .escape(),
  body("education.*.degree")
    .notEmpty()
    .withMessage("Education: degree is required")
    .isString()
    .trim()
    .escape(),
  body("education.*.specialization")
    .notEmpty()
    .withMessage("Education: specialization is required")
    .isString()
    .trim()
    .escape(),
  body("education.*.duration")
    .notEmpty()
    .withMessage("Education: duration is required")
    .isString()
    .trim(),
  body("education.*.completionYear")
    .notEmpty()
    .withMessage("Education: completion year is required")
    .isInt(),
  body("education.*.grade")
    .notEmpty()
    .withMessage("Education: grade is required")
    .isString()
    .trim(),

  // Optional fields (address + additionalInfo)
  body("presentAddress").optional().isString().trim().escape(),
  body("presentCountry").optional().isString().trim().escape(),
  body("presentState").optional().isString().trim().escape(),
  body("presentPostalCode").optional().isPostalCode("IN"),

  body("permanentAddress").optional().isString().trim().escape(),
  body("permanentCountry").optional().isString().trim().escape(),
  body("permanentState").optional().isString().trim().escape(),
  body("permanentPostalCode").optional().isPostalCode("IN"),

  body("additionalInfo").optional().isString().trim().escape(),
];

exports.employeeUpdateValidationRules = [
  body("departmentId")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .trim()
    .escape(),

  body("roleId")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .trim()
    .escape(),

  body("levelId")
    .notEmpty()
    .withMessage("Level is required")
    .isString()
    .trim()
    .escape(),

  body("designationId")
    .notEmpty()
    .withMessage("Designation is required")
    .isString()
    .trim()
    .escape(),
  body("workLocationId")
    .notEmpty()
    .withMessage("Work location is required")
    .isString()
    .trim()
    .escape(),

  body("name").notEmpty().withMessage("Name is required.").trim().escape(),

  body("officialEmail")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .normalizeEmail(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required.")
    .isNumeric()
    .withMessage("Mobile number must contain only numbers.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits long.")
    .trim(),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("uanNumber")
    .notEmpty()
    .withMessage("UAN Number is required")
    .isLength({ min: 12, max: 12 })
    .withMessage("UAN must be 12 digits")
    .isNumeric()
    .withMessage("UAN must be numeric"),

  body("aadharNumber")
    .notEmpty()
    .withMessage("Aadhaar Number is required")
    .matches(/^[2-9]{1}[0-9]{11}$/)
    .withMessage("Invalid Aadhaar Number"),

  body("panNumber")
    .notEmpty()
    .withMessage("PAN Number is required")
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
    .withMessage("Invalid PAN format")
    .toUpperCase(),

  body("accountHolderName")
    .notEmpty()
    .withMessage("Account holder name is required")
    .isString()
    .trim()
    .escape(),

  body("bankName")
    .notEmpty()
    .withMessage("Bank name is required")
    .isString()
    .trim()
    .escape(),

  body("accountNumber")
    .notEmpty()
    .withMessage("Account number is required")
    .isNumeric()
    .withMessage("Account number must be numeric"),

  body("ifscCode")
    .notEmpty()
    .withMessage("IFSC Code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage("Invalid IFSC code")
    .toUpperCase(),

  body("upiId")
    .notEmpty()
    .withMessage("UPI ID is required")
    .matches(/^[\w.-]+@[\w]+$/)
    .withMessage("Invalid UPI ID")
    .trim(),

  body("branchName")
    .notEmpty()
    .withMessage("Branch name is required")
    .isString()
    .trim()
    .escape(),

  body("joiningDate")
    .notEmpty()
    .withMessage("Joining date is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date"),

  body("employeeType")
    .notEmpty()
    .withMessage("Employee type is required")
    .isString()
    .trim()
    .escape(),

  body("assignSalaryStructure")
    .notEmpty()
    .withMessage("Assign salary structure is required")
    .isString()
    .trim()
    .escape(),

  body("payrollEligibility")
    .notEmpty()
    .withMessage("Payroll eligibility is required")
    .isBoolean()
    .withMessage("Must be boolean"),

  body("structure").notEmpty().withMessage("Salary structure is required"),
  // .isObject()
  // .withMessage("Structure is invalid"),

  body("ctc")
    .notEmpty()
    .withMessage("CTC is required")
    .isNumeric()
    .withMessage("CTC must be numeric"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isString()
    .trim()
    .escape(),

  body("totalExperience")
    .notEmpty()
    .withMessage("Total experience is required")
    .isString()
    .trim()
    .escape(),

  body("lastWorkLocation")
    .notEmpty()
    .withMessage("Last work location is required")
    .isString()
    .trim()
    .escape(),

  body("lastCompanyName")
    .notEmpty()
    .withMessage("Last company name is required")
    .isString()
    .trim()
    .escape(),

  body("lastCtc")
    .notEmpty()
    .withMessage("Last CTC is required")
    .isString()
    .trim(),

  // Optional fields (address + additionalInfo)
  body("presentAddress").optional().isString().trim().escape(),
  body("presentCountry").optional().isString().trim().escape(),
  body("presentState").optional().isString().trim().escape(),
  body("presentPostalCode").optional().isPostalCode("IN"),

  body("permanentAddress").optional().isString().trim().escape(),
  body("permanentCountry").optional().isString().trim().escape(),
  body("permanentState").optional().isString().trim().escape(),
  body("permanentPostalCode").optional().isPostalCode("IN"),

  body("additionalInfo").optional().isString().trim().escape(),
];
