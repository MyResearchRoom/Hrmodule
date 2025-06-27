const { Experience } = require("../models");

exports.createExperience = async (data, file) => {
  return await Experience.create({ ...data, experienceLetter: file });
};

exports.getAllExperiences = async (employeeId) => {
  return await Experience.findAll({
    where: {
      employeeId: employeeId,
    },
  });
};

exports.getExperienceById = async (id) => {
  return await Experience.findByPk(id);
};

exports.updateExperience = async (id, data, file) => {
  const experience = await Experience.findByPk(id);
  if (!experience) {
    throw new Error("Experience not found");
  }
  if (file) data.experienceLetter = file;
  await experience.update(data);
  return experience;
};

exports.deleteExperience = async (id) => {
  const experience = await Experience.findByPk(id);
  if (!experience) {
    throw new Error("Experience not found");
  }
  await experience.destroy();
  return true;
};
