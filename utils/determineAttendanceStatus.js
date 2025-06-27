const moment = require("moment-timezone");

function determineStatus(checkIn, checkOut) {
    const officialCheckIn = moment.tz("09:15", "HH:mm", "Asia/Kolkata");
    const inTime = moment(checkIn, "HH:mm:ss");
    const outTime = moment(checkOut, "HH:mm:ss");

    const hoursWorked = moment.duration(outTime.diff(inTime)).asHours();

    if (!checkIn || !checkOut) return "absent";
    if (hoursWorked < 4.5) return "half-day";
    if (inTime.isAfter(officialCheckIn)) return "late";
    if (hoursWorked > 9) return "over-time";

    return "on-time";
}

module.exports = { determineStatus };
