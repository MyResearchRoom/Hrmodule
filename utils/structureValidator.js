exports.structureValidator = (structure, total) => {
  if (!structure || !structure.earnings || !structure.deductions) {
    return {
      valid: false,
      message: "Invalid salary structure",
    };
  }

  let totalEarnings = 0;
  let totalDeductions = 0;

  structure.earnings.forEach((item) => {
    if (!item.earningName || typeof item.percentage !== "number") {
      return {
        valid: false,
        message: "Each earning must have title and percentage",
      };
    }
    if (item.percentage < 0 || item.percentage > 100) {
      return {
        valid: false,
        message: `Earning "${item.earningName}" must be between 0 and 100.`,
      };
    }
    totalEarnings += item.percentage;
  });

  structure.deductions.forEach((item) => {
    if (!item.deductionName || typeof item.percentage != "number") {
      return {
        valid: false,
        message: "Each deduction must have title and percentage",
      };
    }
    if (item.percentage < 0 || item.percentage > 100) {
      return {
        valid: false,
        message: `Deduction "${item.deductionName}" must be between 0 and 100.`,
      };
    }
    totalDeductions += item.percentage;
  });

  if (total !== totalEarnings + totalDeductions) {
    return {
      valid: false,
      message: `Total earnings and deductions must be ${total}`,
    };
  }

  return {
    valid: true,
    message: "Valid salary structure",
  };
};
