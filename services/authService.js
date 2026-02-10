const { User, RefreshToken, UserPermission, Permission } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { refresh_jwt_secret } = require("../config/config");
const { getUserPermissions } = require("./userPermissionService");

exports.login = async ({ officialEmail, password }) => {
  try {
    // console.log("officialEmail",officialEmail);
    
    const user = await User.findOne({
      where: {
        officialEmail,
      },
      attributes: ["id", "officialEmail", "role", "password"],
    });

    if (!user) {
      throw new Error("Invalid email id or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email id or password.");
    }

    let payload = { id: user.id, role: user.role };
    let permissions;

    if (user.role === "HR_EMPLOYEE") {
      permissions = await UserPermission.findAll({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          model: Permission,
          as: "permission",
        },
      });
      permissions = permissions.map((perm) => perm.permission.name);
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "Strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    return {
      accessToken,
      refreshToken,
      permissions,
      role: user.role,
    };
  } catch (error) {
    throw error;
  }
};

exports.refreshToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }
  try {
    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (
      !storedToken ||
      storedToken.isRevoked ||
      storedToken.expiresAt < new Date()
    ) {
      throw new Error("Invalid refresh token");
    }

    const payload = jwt.verify(refreshToken, refresh_jwt_secret);

    // Invalidate old token
    storedToken.isRevoked = true;
    await storedToken.save();

    const newPayload = { id: payload.id, role: payload.role };
    let permissions = [];

    if (payload.role === "HR_EMPLOYEE") {
      permissions = await UserPermission.findAll({
        where: {
          userId: payload.id,
          isActive: true,
        },
        include: {
          model: Permission,
          as: "permission",
        },
      });
      permissions = permissions.map((perm) => perm.permission.name);
    }

    const accessToken = generateAccessToken(newPayload);
    const refreshTokenString = generateRefreshToken(newPayload);

    await RefreshToken.create({
      token: refreshTokenString,
      userId: payload.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      accessToken,
      refreshTokenString,
      permissions,
      role: payload.role,
    };
  } catch (error) {
    throw error;
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "password"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

exports.logout = async ({ refreshToken }) => {
  if (refreshToken) {
    await RefreshToken.update(
      { isRevoked: true },
      { where: { token: refreshToken } }
    );
  }

  return {
    success: true,
  };
};
