import mongoose from 'mongoose';
const dailyExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"],
    },
    date: {
        type: String,
        required: true,
    },
    totalExpense: {
        type: Number,
        required: true,
        default: 0,
    }
}, { timestamps: true });
dailyExpenseSchema.index({ user: 1, date: 1 }, { unique: true });
export const dailyExpense = mongoose.model("dailyExpense", dailyExpenseSchema);
//# sourceMappingURL=dailyExpenseModel.js.map