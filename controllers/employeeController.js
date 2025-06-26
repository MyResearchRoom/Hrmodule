const {
  hrManagerRegistration,
  employeeRegistration,
  getEmployee,
  getMe,
  getHre,
  getEmployees,
  verifyEmployee,
  getStats,
  updateEmployee,
  getUserInfo,
} = require("../services/employeeService");
const { getSalarySlab } = require("../services/salarySlabService");
const { validateQueryParams } = require("../utils/validateQueryParams");

exports.hrManagerRegistration = async (req, res) => {
  try {
    const { name, officialEmail, mobileNumber, password } = req.body;
    const user = await hrManagerRegistration({
      name,
      officialEmail,
      mobileNumber,
      password,
      profilePicture: req.files.profilePicture
        ? `data:${
            req.files.profilePicture[0].mimetype
          };base64,${req.files.profilePicture[0].buffer.toString("base64")}`
        : null,
    });
    res.status(201).json({
      message: "HR Manager Registered Successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in HR Manager Registration", success: false });
  }
};

exports.employeeRegistration = async (req, res) => {
  try {
    const {
      aadharDoc,
      panDoc,
      profilePicture,
      passbookDoc,
      experience,
      education,
      relivingLetter,
    } = req.files;

    const salarySlab = await getSalarySlab(req.body.roleId, req.body.levelId);
    if (!salarySlab) {
      return res
        .status(404)
        .json({ message: "Invalid role or level", success: false });
    }

    const data = await employeeRegistration({
      ...req.body,
      role: req.url === "/registration" ? "EMPLOYEE" : "HR_EMPLOYEE",
      salarySlabId: salarySlab.id,
      aadharDoc: `data:${
        aadharDoc[0].mimetype
      };base64,${aadharDoc[0].buffer.toString("base64")}`,
      panDoc: `data:${panDoc[0].mimetype};base64,${panDoc[0].buffer.toString(
        "base64"
      )}`,
      profilePicture: `data:${
        profilePicture[0].mimetype
      };base64,${profilePicture[0].buffer.toString("base64")}`,
      passbookDoc: `data:${
        passbookDoc[0].mimetype
      };base64,${passbookDoc[0].buffer.toString("base64")}`,
      relivingLetter: `data:${
        relivingLetter[0].mimetype
      };base64,${relivingLetter[0].buffer.toString("base64")}`,
      experienceDoc: experience,
      educationDoc: education,
    });

    res.status(201).json({
      message: "Employee Registered Successfully",
      data,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { aadharDoc, panDoc, profilePicture, passbookDoc, relivingLetter } =
      req.files;

    const salarySlab = await getSalarySlab(req.body.roleId, req.body.levelId);
    if (!salarySlab) {
      return res
        .status(404)
        .json({ message: "Invalid role or level", success: false });
    }
    const data = await updateEmployee({
      ...req.body,
      employeeId: req.params.employeeId,
      salarySlabId: salarySlab.id,
      aadharDoc:
        aadharDoc?.length > 0
          ? `data:${
              aadharDoc[0].mimetype
            };base64,${aadharDoc[0].buffer.toString("base64")}`
          : null,
      panDoc:
        panDoc?.length > 0
          ? `data:${panDoc[0].mimetype};base64,${panDoc[0].buffer.toString(
              "base64"
            )}`
          : null,
      profilePicture:
        profilePicture?.length > 0
          ? `data:${
              profilePicture[0].mimetype
            };base64,${profilePicture[0].buffer.toString("base64")}`
          : null,
      passbookDoc:
        passbookDoc?.length > 0
          ? `data:${
              passbookDoc[0].mimetype
            };base64,${passbookDoc[0].buffer.toString("base64")}`
          : null,
      relivingLetter:
        relivingLetter?.length > 0
          ? `data:${
              relivingLetter[0].mimetype
            };base64,${relivingLetter[0].buffer.toString("base64")}`
          : null,
    });

    res.status(200).json({
      message: "Employee updated Successfully",
      data,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const data = await getEmployee({ employeeId });
    res.status(200).json({ success: true, message: "Employee Details", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const data = await getEmployee({ employeeId });
    res.status(200).json({ success: true, message: "Employee Details", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getUser = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const data = await getMe({ employeeId });
    res.status(200).json({ success: true, message: "Employee Details", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getMe = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const data = await getMe({ employeeId });
    res.status(200).json({ success: true, message: "Employee Details", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getHre = async (req, res) => {
  try {
    const data = await getHre();
    res.status(200).json({ success: true, message: "HRE Details", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { searchTerm } = validateQueryParams({ ...req.query });
    const data = await getEmployees({
      departmentId: req.query.departmentId,
      status: req.query.status,
      joiningDate: req.query.joiningDate,
      searchTerm,
    });
    res.status(200).json({ success: true, message: "Employees Details", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.verifyEmployee = async (req, res) => {
  try {
    if (!["active", "inactive"].includes(req.body.status)) {
      return res
        .status(400)
        .json({ message: "Invalid status", success: false });
    }
    const data = await verifyEmployee({
      employeeId: req.params.employeeId,
      status: req.body.status,
    });
    res.status(200).json({ success: true, message: "Employee Verified", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getStats = async (req, res) => {
  try {
    const data = await getStats();
    res.status(200).json({ success: true, message: "Statistics", data });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    await getUserInfo(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve employee information",
    });
  }
};
