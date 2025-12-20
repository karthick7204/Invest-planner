import { expense } from '../models/expenseModel.js';
export const createExpense = async (req, res) => {
    try {
        const expensedata = new expense(req.body);
        const savedExpenseData = await expensedata.save();
        const token = req.headers.authorization;
        if (!token) {
            res.status(500).json({ message: "jwt not found" });
        }
        const decodedToken = jwt.verify(token, secretkey);
        res.status(200).json(savedExpenseData);
    }
    catch (error) {
        res.status(500).send("internal error");
    }
};
//# sourceMappingURL=expenseController.js.map