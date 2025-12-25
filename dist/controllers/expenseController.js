import { expense } from '../models/expenseModel.js';
export const createExpense = async (req, res) => {
    const UserId = req.userId;
    try {
        const expensedata = new expense({ ...req.body, user: UserId });
        const savedExpenseData = await expensedata.save();
        res.status(200).json({ savedExpenseData });
    }
    catch (error) {
        console.log("expense controller not wokring ", error);
        res.status(500).send("internal error-expensecontrol");
    }
};
//# sourceMappingURL=expenseController.js.map