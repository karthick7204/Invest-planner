import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",               // refers to User model
      required: true,
    },
    purpose:{
        type:String,
        required:true,

    },
    amount:{
        type:Number,
        required:true,
        min:0,
    },
    category:{
        type:String,
        required:true,
    },
    date:{
        type:Number,
    },
    time:{
        type:Number,
    },

},
{timestamps:true}
);

export const expense = mongoose.model("expense",expenseSchema)