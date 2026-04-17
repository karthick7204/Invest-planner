import mongoose from "mongoose"

const incomeSchema = new mongoose.Schema({
    user: {
       type:mongoose.Schema.Types.ObjectId,
       ref:"user",
       required:[true, "user is required"]
    },
    purpose:{
        type:String,
        trim: true,
        default: "General",
    },
    amount: {
        type:Number,
        required:[true, "income is required"],
        min:[0, "income cannot be negative"]
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
},
{timestamps:true}
);
export const income = mongoose.model("income",incomeSchema)