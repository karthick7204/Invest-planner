import { expense } from '../models/expenseModel.js';
import { tokenauth } from '../middleware/authenticationToken.js';
const secretkey = process.env.JWT_SECRET;
export const createExpense = async (req, res) => {
    try {
        const expensedata = new expense(req.body);
        const savedExpenseData = await expensedata.save();
        tokenauth(secretkey);
        res.status(200).json(savedExpenseData);
    }
    catch (error) {
        res.status(500).send("internal error");
    }
};
//# sourceMappingURL=expenseController.js.map