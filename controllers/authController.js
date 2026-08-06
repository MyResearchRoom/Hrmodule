const {
  login,
  refreshToken,
  logout,
  changePassword,
} = require("../services/authService");
const bcrypt = require("bcrypt");
const { transporter } = require("../services/emailService");
const jwt = require("jsonwebtoken")

const { User } = require("../models");
const createAuditLog = require("../utils/createAuditLogs");

exports.login = async (req, res) => {
  try {
    // console.log("req.body",req.body);
    
    const { accessToken, refreshToken, permissions, role,user } = await login({
      ...req.body,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await createAuditLog({
        req,
        userId: user.id,
        action: "LOGIN",
        description: `User (${user.name}) authenticated successfully and logged into the system.`,
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
    
    res.status(500).json({ success: false, message: error.message || "Fail to login" });
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
    
    const {success,tokenRecord} = await logout({ ...req.cookies });

    

    res.clearCookie("refreshToken");

    if (tokenRecord) {
      await createAuditLog({
        req,
        userId: tokenRecord.userId,
        action: "LOGOUT",
        description: "User logged out successfully.",
      });
    }


    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files?.profilePicture) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required to change profile.",
      });
    }

    const profilePicture = `data:${
      req.files.profilePicture[0].mimetype
    };base64,${req.files.profilePicture[0].buffer.toString("base64")}`;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.profilePicture = profilePicture;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to change profile.",
    });
  }
};

exports.forgotPassword = async (req, res)=>{
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { officialEmail:email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    const resetToken = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1h"
      }
    );

    const mailOptions = {
      from: `"HR Support" <${process.env.EMAIL}>`,
      to: user.officialEmail,
      subject: "Reset Your Hr.Wesolutize Account Password",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                        <!-- Header -->
                        <div style="padding: 16px; text-align: center; border-bottom: 2px solid #000000;">
                        <h2 style="color: #000000; margin: 0;">Hr.Wesolutize</h2>
                        <p style="color: #000000; margin: 8px 0 0;">
                            Password Reset Request
                        </p>
                        </div>

                        <!-- Body -->
                        <div style="padding: 30px; color: #333333;">

                        <p>Hello,</p>

                        <p>
                            We received a request to reset the password for your
                            <strong>Hr.Wesolutize</strong> account.
                        </p>

                        <p>
                            Click the button below to create a new password:
                        </p>

                        <div style="text-align: center; margin: 35px 0;">
                            <a
                            href="${process.env.CLIENT_URL_2}/reset-password/${resetToken}"
                            style="
                                background: #280dc5;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 14px 28px;
                                border-radius: 6px;
                                display: inline-block;
                                font-size: 16px;
                                font-weight: bold;
                            "
                            >
                            Reset Password
                            </a>
                        </div>

                        <p style="margin-top: 25px;">
                            This password reset link will expire in
                            <strong>1 hour</strong>.
                        </p>

                        <div style="
                            background: #FFF8E1;
                            border-left: 4px solid #280dc5;
                            padding: 15px;
                            margin: 25px 0;
                            border-radius: 4px;
                            ">
                            <strong>Security Notice</strong>
                            <p style="margin: 10px 0 0;">
                            If you did not request a password reset, you can safely ignore
                            this email. Your account will remain secure, and no changes will
                            be made.
                            </p>
                        </div>

                        <p>
                            If the button above doesn't work, copy and paste the following link
                            into your browser:
                        </p>

                        <p style="word-break: break-all; color: #280dc5;">
                            ${process.env.CLIENT_URL_2}/reset-password/${resetToken}
                        </p>

                        <p style="margin-top: 35px;">
                            Regards,<br>
                            <strong>NeoWesolutize Team</strong>
                        </p>

                        </div>

                        <!-- Footer -->
                        <div style="background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #777777;">
                        This is an automated email. Please do not reply to this message.<br><br>
                        © ${new Date().getFullYear()} NeoWesolutize. All Rights Reserved.
                        </div>

                    </div>
            </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
      token: resetToken
    });

  } catch (error) {
    console.log("error",error);
            
    return res.status(500).json({
      success: false,
      message: "Failed to send reset link"
    })
  }
};

exports.resetPassword = async (req, res)=>{
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    } catch (error) {
      console.log("error in decoding token",error);
      
      return res.status(400).json({
        success: false,
            message: "Invalid or expired reset token"
      });
    }


    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    await createAuditLog({
        req,
        userId: user.id,
        action: "RESET_PASSWORD",
        description: `User "${user.name}" (${user.role}) reset their password.`,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

    }catch (error) {
      console.log("error",error);
      
            return res.status(500).json({
                success: false,
                message: "Failed to reset password"
            });
    }
};