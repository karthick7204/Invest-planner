import mongoose from "mongoose";
const incomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        Required: true
    },
    income: {
        type: Number,
        Required: true
    }
});
export const income = mongoose.model("income", incomeSchema);
//# sourceMappingURL=incomeModel.js.map