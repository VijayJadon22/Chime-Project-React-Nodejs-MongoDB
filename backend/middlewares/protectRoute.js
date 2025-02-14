import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
    try {
        // Extract the token from the cookies
        const token = req.cookies.token;
        // Check if the token is missing
        if (!token) {
            return res.status(401).json({ error: "Not authorized to access this route" });
        }
        // Verify the token using the secret key
        const decodedData = jwt.verify(token, process.env.JWT_Secret);
        // Check if the token is invalid
        if (!decodedData) {
            return res.status(401).json({ error: "Unauthorized: invalid token" });
        }

        // Find the user by the ID from the decoded token
        const user = await User.findById(decodedData.userId).select("-password");
        // Check if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Attach the user to the request object
        req.user = user;
        // Pass control to the next middleware or route handler
        next();

    } catch (error) {
        // Log any errors and send a 500 Internal Server Error response
        console.error("Error in protectRoute middleware: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
