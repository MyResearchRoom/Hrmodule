const {
  grantPermission,
  revokePermission,
  getUserPermissions,
  getPermissions,
} = require("../services/userPermissionService");

exports.grantPermission = async (req, res) => {
  try {
    const data = await grantPermission(req.body);
    res
      .status(201)
      .json({ message: "Permission granted", data, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.revokePermission = async (req, res) => {
  try {
    const id = req.params.id;
    await revokePermission(id);
    res.status(200).json({ message: "Permission revoked", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getUserPermissions = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }
    const data = await getUserPermissions(userId);
    res.status(200).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const data = await getPermissions();
    res.status(200).json({ data, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
