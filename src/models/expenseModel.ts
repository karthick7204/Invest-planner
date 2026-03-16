import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    purpose:{
        type:String,
        trim: true,
        default: "General",

    },
    amount:{
        type:Number,
        required:[true, "amount is required"],
        min:[0, "amount cannot be negative"],
    },
    category:{
        type:String,
        trim: true,
        default: "Other",
    },
    date:{
        type:Date,
        default: Date.now,
    },
    time:{
        type:Number,
    },

},
{timestamps:true}
);

export const expense = mongoose.model("expense",expenseSchema)