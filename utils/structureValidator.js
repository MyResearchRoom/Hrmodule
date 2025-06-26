exports.structureValidator = (structure, total, fix) => {
  if (!structure || !structure.earnings || !structure.deductions) {
    throw new Error("Invalid salary structure");
  }

  let totalEarnings = 0;
  let totalDeductions = 0;

  structure.earnings.forEach((item) => {
    
    if (!item.earningName || typeof item.percentage !== "number")
      throw new Error("Each earning must have title and percentage");
    if (item.percentage < 0 || item.percentage > 100)
      throw new Error(`Earning "${item.earningName}" must be between 0 and 100.`);
    totalEarnings += item.percentage;
  });

  structure.deductions.forEach((item) => {
    if (!item.deductionName || typeof item.percentage != "number")
      throw new Error("Each deduction must have title and percentage");
    if (item.percentage < 0 || item.percentage > 100)
      throw new Error(`Deduction "${item.deductionName}" must be between 0 and 100.`);
    totalDeductions += item.percentage;
  });

  if (total !== totalEarnings + totalDeductions && fix) {
    throw new Error(`Total earnings and deductions must be ${total}`);
  }

  return true;
};
