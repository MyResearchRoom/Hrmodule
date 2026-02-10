const {
  login,
  refreshToken,
  logout,
  changePassword,
} = require("../services/authService");

exports.login = async (req, res) => {
  try {
    // console.log("req.body",req.body);
    
    const { accessToken, refreshToken, permissions, role } = await login({
      ...req.body,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        accessRoute: permissions,
        role,
      },
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { accessToken, refreshTokenString, permissions, role } =
      await refreshToken({
        ...req.cookies,
      });

    res.cookie("refreshToken", refreshTokenString, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        accessRoute: permissions,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    await changePassword(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await logout({ ...req.cookies });
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
