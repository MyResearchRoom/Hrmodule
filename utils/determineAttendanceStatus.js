// const moment = require("moment-timezone");

// function determineStatus(checkIn, checkOut) {
//     const officialCheckIn = moment.tz("09:15", "HH:mm", "Asia/Kolkata");
//     const inTime = moment(checkIn, "HH:mm:ss");
//     const outTime = moment(checkOut, "HH:mm:ss");

//     const hoursWorked = moment.duration(outTime.diff(inTime)).asHours();
//     if (!checkIn || !checkOut) return "absent";
//     if (inTime.isAfter(officialCheckIn)) return "late";
//     if (hoursWorked < 4.5) return "half-day";
//     // if (hoursWorked > 9) return "over-time";'
//     if (inTime.isBefore(officialCheckIn)) {
//         if (hoursWorked > 9){
//             return "over-time";
//         } else if(hoursWorked < 9 &&hoursWorked > 4.5){
//             // return "late";
//             return "on-time"
//         }
//         // return "late";
//     }
//     return "on-time";
// }

// module.exports = { determineStatus };

const moment = require("moment-timezone");

function determineStatus(checkIn, checkOut) {
    // const officialCheckIn = moment.tz("09:15", "HH:mm", "Asia/Kolkata");
    const officialCheckIn = moment("09:15:00", "HH:mm:ss");
    const inTime = moment(checkIn, "HH:mm:ss");
    const outTime = moment(checkOut, "HH:mm:ss");

    const hoursWorked = moment.duration(outTime.diff(inTime)).asHours();
    if (!checkIn || !checkOut) return "absent";
    
    if (inTime.isBefore(officialCheckIn)) {
        if (hoursWorked > 9){
            return "over-time";
        } else if(hoursWorked < 9 && hoursWorked > 4.5){
            return "on-time"
        } else if (hoursWorked < 4.5) {
            return "half-day";
        }
    }
    if (inTime.isAfter(officialCheckIn)) return "late";
    return "on-time";
}

module.exports = { determineStatus };
