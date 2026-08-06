const { Op } = require("sequelize");
const {User,AuditLog,sequelize} =require("../models");
const { validateQueryParams } = require("../utils/validateQueryParams");

exports.getAuditLogs = async(req,res) =>{
    try{
        const { page, limit, searchTerm } = validateQueryParams({ ...req.query });
        const {role}=req.query

        const offset = (page - 1) * limit;
        const whereClause = {};
        const userWhereClause = {};

        if (searchTerm) {
            whereClause[Op.or] = [
                { userId: { [Op.like]: `%${searchTerm}%` } },
                { action: { [Op.like]: `%${searchTerm}%` } },
                { ipAddress: { [Op.like]: `%${searchTerm}%` } },
            ];
        }

        if (role) {
            userWhereClause.role = role;
        }

        const { count, rows } = await AuditLog.findAndCountAll(
            {
                where: whereClause,
    
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name","role"],
                        where: userWhereClause,
                        required: Object.keys(userWhereClause).length > 0,
                    },
                ],
                order: [["createdAt", "DESC"]],
                offset,
                limit,
            });

        return res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                page,
                limit,
            },
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
  }
};