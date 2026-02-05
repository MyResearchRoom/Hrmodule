/**
 *
 * @param {String} fromDate - Start date in YYYY-MM-DD
 * @param {String} toDate - End date in YYYY-MM-DD
 * @param {Set<string>} holidaysSet - Set of holiday dates in 'YYYY-MM-DD' format
 * @returns {number} - Total working days (excluding weekends and holidays)
 */

// exports.calculateDaysBetween = (fromDate, toDate, holidaysSet = new Set()) => {
//   const from = new Date(fromDate);
//   const to = new Date(toDate);
//   let count = 0;

//   const current = new Date(from);

//   while (current <= to) {
//     const dayOfWeek = current.getDay();
//     const dateStr = current.toISOString().split("T")[0];

//     const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
//     const isHoliday = holidaysSet.has(dateStr);

//     if (!isWeekend && !isHoliday) {
//       count++;
//     }

//     current.setDate(current.getDate() + 1);
//   }

//   return count;
// };

exports.calculateDaysBetween = (fromDate, toDate, holidaysSet = new Set()) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  let count = 0;

  const current = new Date(from);

  while (current <= to) {
    const dayOfWeek = current.getDay(); 
    const dateStr = current.toISOString().split("T")[0];

    const isSunday = dayOfWeek === 0;

    let isSecondOrFourthSaturday = false;

    if (dayOfWeek === 6) {
      const dayOfMonth = current.getDate();
      const weekOfMonth = Math.ceil(dayOfMonth / 7);
      isSecondOrFourthSaturday = weekOfMonth === 2 || weekOfMonth === 4;
    }

    const isWeekend = isSunday || isSecondOrFourthSaturday;
    const isHoliday = holidaysSet.has(dateStr);

    if (!isWeekend && !isHoliday) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
};
