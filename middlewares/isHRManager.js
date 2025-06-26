exports.isHRManager = (req, res, next) => {
  if (req.user.role !== "HR_MANAGER") {
    return res
      .status(403)
      .json({ message: "Only HR_MANAGER can perform this action" });
  }
  next();
};
