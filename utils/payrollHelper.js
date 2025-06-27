exports.calculateNetSalary = (structure) => {
  const earningsTotal = Object.values(structure.earnings || {}).reduce(
    (sum, val) => sum + parseFloat(val || 0),
    0
  );

  const deductionsTotal = Object.values(structure.deductions || {}).reduce(
    (sum, val) => sum + parseFloat(val || 0),
    0
  );

  return {
    gross: earningsTotal,
    deductions: deductionsTotal,
    net: earningsTotal - deductionsTotal,
  };
};
