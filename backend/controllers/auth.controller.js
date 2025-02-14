import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";


// Controller function for user signup
export const signup = async (req, res) => {
    try {
        // Extracting required fields from request body
        const { username, fullName, email, password } = req.body;

        // Regex for validating email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" }); // Invalid email format
        }

        // Checking if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" }); // Username already taken
        }

        // Checking if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" }); // Email already taken
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be atleast 6 characters long" });
        }

        // Creating a new user instance
        const newUser = new User({
            username,
            fullName,
            email,
            password
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser, res); // Generate token and set cookie for the new user
            await newUser.save(); // Save the new user to the database

            // Return the newly created user data as JSON response
            return res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                followers: newUser.followers,
                following: newUser.following
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" }); // Invalid user data
        }
    } catch (error) {
        console.error("Error in signup controller: ", error);
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