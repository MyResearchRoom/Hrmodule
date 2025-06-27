const { SalarySlab } = require("../models");

exports.getSalarySlab = async (roleId, levelId) => {
  return await SalarySlab.findOne({ where: { roleId, levelId } });
};
