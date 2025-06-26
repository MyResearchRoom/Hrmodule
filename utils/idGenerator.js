exports.generateUserId = (role) => {
  const prefixMap = {
    HR_MANAGER: "HRM",
    HR_EMPLOYEE: "HRE",
    EMPLOYEE: "EMP",
  };
  const prefix = prefixMap[role] || "USR";
  const randomPart = Math.random().toString(36).substring(6, 10).toUpperCase(); // 4 chars
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  return `${prefix}${randomPart}${timestamp}`;
};

exports.generateClaimId = () => {
  const prefix = "CLM";
  const randomPart = Math.random().toString(36).substring(6, 10).toUpperCase(); // 4 chars
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  return `${prefix}${randomPart}${timestamp}`;
};