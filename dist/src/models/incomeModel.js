import mongoose from "mongoose";
const incomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    income: {
        type: Number,
        required: [true, "income is required"],
        min: [0, "income cannot be negative"]
    }
}, { timestamps: true });
export const income = mongoose.model("income", incomeSchema);
//# sourceMappingURL=incomeModel.js.map