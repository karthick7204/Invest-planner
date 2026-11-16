import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
      type : String,
      required: [true, "username is required"],
      trim: true,
    },
    email:{
      type:String,
      required:[true, "email is required"],
      trim: true,
      lowercase: true,
    },
    password:{
      type: String,
      required: function (this: any) {
        return this.authProvider !== "google";
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: {
      type: String,
      default: "",
    },
},{timestamps:true})

export const user = mongoose.model("user",userSchema)