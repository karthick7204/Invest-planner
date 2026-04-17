import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
}, { timestamps: true });
export const user = mongoose.model("user", userSchema);
//# sourceMappingURL=userModel.js.map