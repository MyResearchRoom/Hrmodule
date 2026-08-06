const {
  leaveRequest,
  actionOnLeaveRequest,
  multipleApproves,
  getLeaves,
  getLeaveBalances,
  getLeaveById,
  getLeaveStats,
} = require("../services/leaveService");
const { getHolidaysDate } = require("../services/holidayService");
const { validateQueryParams } = require("../utils/validateQueryParams");

exports.leaveRequest = async (req, res) => {
  try {
    const { calculateDaysBetween } = require("../utils/dateHelper");
    const holidaysDate = await getHolidaysDate();
    console.log("from date",req.body.fromDate);
    console.log("To date",req.body.toDate);
    const data = await leaveRequest({
      ...req.body,
      employeeId: req.user.id,
      daysRequested: calculateDaysBetween(
        req.body.fromDate,
        req.body.toDate,
        new Set(holidaysDate)
      ),
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actionOnLeaveRequest = async (req, res) => {
  try {
    const data = await actionOnLeaveRequest({
      ...req.body,
      leaveId: req.params.id,
      approvedBy: req.user.id,
    });
    res.status(200).json({
      success: true,
      message: `Leave request ${req.body.status} successfully`,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.multipleApproves = async (req, res) => {
  try {
    const { leaveIds } = req.body;
    const data = await multipleApproves({ leaveIds, approvedBy: req.user.id });
    res.status(200).json({
      success: true,
      message: "Multiple leave requests approved successfully",
      data: leaveIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const { page, limit, searchTerm } = validateQueryParams({ ...req.query });
    const data = await getLeaves({
      page,
      limit,
      searchTerm,
      status: req.query.status,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      leaveTypeId: req.query.leaveTypeId,
      employeeId: req.query.employeeId,
      scope: req.query.scope,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployeeLeaves = async (req, res) => {
  try {
    const { page, limit, searchTerm } = validateQueryParams({ ...req.query });
    const data = await getLeaves({
      page,
      limit,
      searchTerm,
      status: req.query.status,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      leaveTypeId: req.query.leaveTypeId,
      employeeId: req.user.id,
      scope: req.query.scope,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaveBalances = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await getLeaveBalances({
      employeeId: req.params.employeeId,
      year,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployeeLeaveBalances = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await getLeaveBalances({
      employeeId: req.user.id,
      year,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaveById = async (req, res) => {
  try {
    const data = await getLeaveById({ leaveId: req.params.id });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaveStats = async (req, res) => {
  try {
    const data = await getLeaveStats();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
