const { Op } = require("sequelize");
const {Policy,sequelize} =require("../models");
const { validateQueryParams } = require("../utils/validateQueryParams");

exports.addPolicies = async (req,res) =>{
    try {
        const { title, description } = req.body;

        if (!title) {
        return res.status(400).json({
            success: false,
            message: "Policy title is required.",
        });
        }

        let document = null;
        let documentContentType = null;

        if (req.files?.document?.length) {
            document = req.files.document[0].buffer;
            documentContentType = req.files.document[0].mimetype;
        }

        const policy = await Policy.create({
            title,
            description: description ? description : null,
            document,
            documentContentType,
        });


        return res.status(201).json({
            success: true,
            message: "Policy added successfully.",
            data: policy,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPolicies = async(req,res) =>{
    try{
        const { page, limit, searchTerm } = validateQueryParams({ ...req.query });


        const offset = (page - 1) * limit;
        const whereClause = {};

        if (searchTerm) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${searchTerm}%` } },
                { description: { [Op.like]: `%${searchTerm}%` } },
            ];
        }

        const { count, rows } = await Policy.findAndCountAll(
            {
                where: whereClause, 
                
                order: [["createdAt", "DESC"]],
                offset,
                limit,
        });

        const policies = rows.map((policy) => {
            const data = policy.toJSON();

            if (data.document) {
                data.document = `data:${data.documentContentType};base64,${Buffer.from(
                data.document
                ).toString("base64")}`;
            }

            return data;
        });

        return res.status(200).json({
            success: true,
            data: policies,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                page,
                limit,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found.",
      });
    }

    const data = policy.toJSON();

    if (data.document) {
      data.document = `data:${data.documentContentType};base64,${Buffer.from(
        data.document
      ).toString("base64")}`;
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Policy title is required.",
        });
    }

    const policy = await Policy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found.",
      });
    }


    const updateData = {
      title,
      description: description ?description : null,
    };

    if (req.files?.document?.length) {
      updateData.document = req.files.document[0].buffer;
      updateData.documentContentType = req.files.document[0].mimetype;
    }

    await policy.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Policy updated successfully.",
      data: policy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found.",
      });
    }

    await policy.destroy();

    return res.status(200).json({
      success: true,
      message: "Policy deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};