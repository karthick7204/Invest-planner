import mongoose from 'mongoose';
const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"],
    },
    category: {
        type: String,
        required: [true, "category is required"],
        trim: true,
    },
    limit: {
        type: Number,
        required: [true, "limit amount is required"],
        min: [0, "limit cannot be negative"],
    },
    month: {
        type: String, // format: "YYYY-MM"
        required: [true, "month is required"],
    },
}, { timestamps: true });
// Make each category unique per user per month
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });
export const budget = mongoose.model("budget", budgetSchema);
//# sourceMappingURL=budgetModel.js.map