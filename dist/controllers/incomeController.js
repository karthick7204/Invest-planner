import { income } from '../models/incomeModel.js';
export const createincome = async (req, res) => {
    let userId = req.userId;
    try {
        const incomeAmount = new income({
            user: userId,
            income: req.body.income || req.body.amount
        });
        const savedIncomeAmount = await incomeAmount.save();
        console.log("createincome - saved document:", savedIncomeAmount);
        if (!savedIncomeAmount) {
            return res.status(400).json({ message: "no income data" });
        }
        return res.status(201).json({ incomedata: savedIncomeAmount });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in incomecontrol", error });
    }
};
export const getIncome = async (req, res) => {
    const userId = req.userId;
    console.log("getIncome - userId:", userId);
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const incomedata = await income.find({ user: userId });
        console.log("getIncome - found:", incomedata);
        res.status(200).send({ income: incomedata });
    }
    catch (error) {
        return res.status(500).json({ message: "error in getincome", error });
    }
};
export const totalIncome = async (req, res) => {
};
//# sourceMappingURL=incomeController.js.map