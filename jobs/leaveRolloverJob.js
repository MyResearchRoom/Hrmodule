const cron = require("node-cron");
const { EmployeeLeaveBalance, LeaveSetting } = require("../models");

const rolloverLeaveBalances = async () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const previousBalances = await EmployeeLeaveBalance.findAll({
    where: { year: currentYear },
    include: ["LeaveSetting"],
  });

  const newBalances = previousBalances.map((prev) => {
    const carriedForward = prev.LeaveSetting.carryForward ? prev.remaining : 0;

    return {
      employeeId: prev.employeeId,
      leaveTypeId: prev.leaveTypeId,
      year: nextYear,
      allocated: prev.LeaveType.defaultCount,
      used: 0,
      carriedForward,
      remaining: prev.LeaveType.defaultCount + carriedForward,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // Bulk insert new year balances
  await EmployeeLeaveBalance.bulkCreate(newBalances, {
    ignoreDuplicates: true,
  });

  console.log(
    `[${new Date().toISOString()}] Leave balances rolled over for ${nextYear}`
  );
};

module.exports = () => {
  // Every year on Dec 31st at 11:59 PM
  cron.schedule("59 23 31 12 *", rolloverLeaveBalances, {
    timezone: "Asia/Kolkata", // Adjust based on your region
  });
};
