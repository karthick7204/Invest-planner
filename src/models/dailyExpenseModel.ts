import mongoose, { Document, Types } from 'mongoose'

export interface IDailyExpense extends Document {
    user: Types.ObjectId;
    date: string;
    totalExpense: number;
}

const dailyExpenseSchema = new mongoose.Schema<IDailyExpense>({
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
},
    { timestamps: true }
);

dailyExpenseSchema.index({ user: 1, date: 1 }, { unique: true });

export const dailyExpense = mongoose.model<IDailyExpense>("dailyExpense", dailyExpenseSchema);
