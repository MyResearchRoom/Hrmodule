const { AuditLog } = require("../models");

const createAuditLog = async ({
  req,
  userId,
  action,
  description,
  oldData = null,
  newData = null,
}) => {
  try {
    let ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip;

    if (ipAddress === "::1") {
      ipAddress = "127.0.0.1";
    }

    if (ipAddress.startsWith("::ffff:")) {
      ipAddress = ipAddress.replace("::ffff:", "");
    }

    await AuditLog.create({
      userId,
      action,
      description,
      ipAddress,
      userAgent: req.get("User-Agent"),
      method: req.method,
      endpoint: req.originalUrl,
      oldData,
      newData,
    });
    
  } catch (err) {
    console.error("Audit Log Error:", err);
  }
};

module.exports = createAuditLog;