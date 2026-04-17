import mongoose, { Document, Types } from 'mongoose';
export interface IDailyExpense extends Document {
    user: Types.ObjectId;
    date: string;
    totalExpense: number;
}
export declare const dailyExpense: mongoose.Model<IDailyExpense, {}, {}, {}, mongoose.Document<unknown, {}, IDailyExpense, {}, mongoose.DefaultSchemaOptions> & IDailyExpense & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IDailyExpense>;
//# sourceMappingURL=dailyExpenseModel.d.ts.map