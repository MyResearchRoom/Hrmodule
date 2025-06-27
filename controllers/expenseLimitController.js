const { ExpenseLimit, Role } = require("../models");

exports.addExpenseLimit = async (req, res) => {
  try {
    const { roleId, expenseStructure, period } = req.body;

    if (!roleId || !expenseStructure || !period) {
      return res.status(400).json({
        success: false,
        message: "Please fill required fields.",
      });
    }

    //calculate total limit
    let totalLimit = 0;
    expenseStructure.forEach((item) => {
      totalLimit += Number(item.limit);
    });

    totalLimit = totalLimit.toFixed(2);

    const expenseLimit = await ExpenseLimit.create({
      roleId,
      expenseStructure,
      period,
      totalLimit,
    });

    res.status(201).json({
      success: true,
      message: "Expense limit added successfully.",
      data: expenseLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add expense Limit",
    });
  }
};

exports.getExpenseLimitList = async (req, res) => {
  try {
    const expenseLimit = await ExpenseLimit.findAll({
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Expense limit retrieved successfully!",
      data: expenseLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve expense limit",
    });
  }
};

exports.editExpenseLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId, expenseStructure, period } = req.body;

    if (!roleId || !expenseStructure || !period) {
      return res.status(400).json({
        success: false,
        message: "Please fill the required fields",
      });
    }

    let totalLimit = 0;
    expenseStructure.forEach((item) => {
      totalLimit += parseFloat(item.limitAmount);
    });

    const expenseLimit = await ExpenseLimit.findByPk(id);

    if (!expenseLimit) {
      return res.status(404).json({
        success: false,
        message: "Expense limit not found",
      });
    }

    await expenseLimit.update({
      roleId: roleId || expenseLimit.roleId,
      expenseStructure: expenseStructure || expenseLimit.expenseStructure,
      period: period || expenseLimit.period,
      totalLimit: totalLimit,
    });

    res.status(200).json({
      success: true,
      message: "Expense limit updated successfully!",
      data: expenseLimit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update expense limit",
    });
  }
};

exports.deleteExpenseLimit = async (req, res) => {
  try {
    const { id } = req.params;

    const expenseLimit = await ExpenseLimit.findByPk(id);

    if (!expenseLimit) {
      return res.status(404).json({
        success: false,
        message: "Expense Limit not found",
      });
    }

    await expenseLimit.destroy();

    res.status(200).json({
      success: true,
      message: "Expense Limit deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete Expense Limit",
    });
  }
};
