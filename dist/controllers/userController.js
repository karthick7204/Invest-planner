import { user } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
export const createuser = async (req, res) => {
    try {
        const userdata = new user(req.body);
        const saveduser = await userdata.save();
        console.log("it is wokring");
        res.status(200).json({ saveduser });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userdata = await user.findOne({ username, email, password });
        if (!userdata) {
            return res.status(404).json({ message: "user not found" });
        }
        let token;
        try {
            token = jwt.sign({
                userId: userdata._id,
                email: userdata.email,
            }, process.env.JWT_SECRET, { expiresIn: "1h" });
        }
        catch (err) {
            console.log(err);
            const error = new Error("Error! Something went wrong.");
        }
        res.status(200).json({ message: "logged in sucessfully",
            data: { userdata,
                token
            } });
    }
    catch (error) {
        console.log("usercontroller error");
        res.status(500).json({ error: "internal error " });
    }
};
export const updateusername = async (req, res) => {
    try {
        const userid = req.params.id;
        const { username } = req.body;
        const updateuser = await user.findByIdAndUpdate(userid, { username }, { new: true });
        if (!updateuser) {
            return res.status(500).send("use not found");
        }
        res.status(200).json({ message: "username updated", updateuser });
    }
    catch (error) {
        res.status(500).json({ error: "internal error" });
    }
};
export const deleteusername = async (req, res) => {
    try {
        const userid = req.params.id;
        const userexist = await user.findByIdAndDelete(userid);
        if (!userexist) {
            return res.status(500).json("use not found");
        }
        res.status(200).json({ message: "user gets deleted", userexist });
    }
    catch (error) {
        res.status(500).json({ error: "internal error" });
    }
};
//# sourceMappingURL=userController.js.map