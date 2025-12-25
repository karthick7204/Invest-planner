import { expense } from '../models/expenseModel.js';
const secretkey = process.env.JWT_SECRET;
export const createExpense = async (req, res) => {
    const Userid = req.userId;
    try {
        const expensedata = new expense(...req.body, Userid);
        const savedExpenseData = await expensedata.save();
        res.status(200).json({ Userid, savedExpenseData });
    }
    catch (error) {
        console.log("expense controller not wokring ");
        res.status(500).send("internal error");
    }
};
//# sourceMappingURL=expenseController.js.map