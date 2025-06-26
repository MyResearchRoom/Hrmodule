const { Education } = require("../models");

exports.createEducation = async (data, file) => {
  return await Education.create({ ...data, doc: file });
};

exports.getAllEducations = async ({ employeeId }) => {
  return await Education.findAll({ where: { employeeId } });
};

exports.getEducationById = async (id) => {
  return await Education.findByPk(id);
};

exports.updateEducation = async (id, data, file) => {
  const education = await Education.findOne({
    where: { id, employeeId: data.employeeId },
  });
  if (!education) {
    throw new Error("Education not found");
  }
  if (file) data.doc = file;
  await education.update(data);
  return education;
};

exports.deleteEducation = async (id) => {
  const education = await Education.findByPk(id);
  if (!education) {
    throw new Error("Education not found");
  }
  await education.destroy();
  return true;
};
