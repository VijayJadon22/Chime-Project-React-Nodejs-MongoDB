import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (email) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        const newuser = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        });

        if (newuser) {
            await newuser.
        }
    } catch (error) {

    }
}

export const login = async (req, res) => {
    return res.json({
        data: "You hit the login endpoint"
    })
}

export const logout = async (req, res) => {
    return res.json({
        data: "You hit the logout endpoint"
    })
}