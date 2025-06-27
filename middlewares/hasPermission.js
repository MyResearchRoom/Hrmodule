const { UserPermission, Permission } = require("../models");

const hasPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (user.role === "HR_MANAGER") return next();

      if (user.role !== "HR_EMPLOYEE") {
        return res.status(403).json({ message: "Access denied" });
      }

      const userPermission = await UserPermission.findOne({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          model: Permission,
          where: { name: requiredPermission },
          as: "permission",
        },
      });

      if (!userPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = hasPermission;
