import mongoose from "mongoose"

const incomeSchema = new mongoose.Schema({
    user: {
       type:String,
       ref:"User",
       required:true
    },
    income: {
        type:Number,
        required:true
    }
})
export const income = mongoose.model("income",incomeSchema)