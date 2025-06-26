const { UserPermission, Permission, sequelize } = require("../models");

exports.grantPermission = async ({ userId, permissionIds }) => {
  if (!userId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    throw new Error("userId and permissionIds are required");
  }

  const transaction = await sequelize.transaction();

  try {
    await UserPermission.destroy({ where: { userId }, transaction });

    const newPermissions = permissionIds.map((id) => ({
      userId,
      permissionId: id,
      grantedAt: new Date(),
      isActive: true,
    }));

    const createdPermissions = await UserPermission.bulkCreate(newPermissions, {
      transaction,
    });

    await transaction.commit();
    return createdPermissions;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.revokePermission = async (id) => {
  const permission = await UserPermission.findByPk(id);
  if (!permission) throw new Error("Permission not found");
  await permission.update({ isActive: false });
};

exports.getUserPermissions = async (userId) => {
  const permissions = await UserPermission.findAll({
    where: { userId, isActive: true },
    include: [
      {
        model: Permission,
        attributes: ["id", "name"],
        as: "permission",
      },
    ],
  });

  return permissions.map((permission) => permission.permissionId);
};

exports.getPermissions = async () => {
  return await Permission.findAll();
};
