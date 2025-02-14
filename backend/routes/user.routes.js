import express from "express"; // Import the express module
import { protectRoute } from "../middlewares/protectRoute.js"; // Import the protectRoute middleware
import { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } from "../controllers/user.controller.js"; // Import the controller functions

const router = express.Router(); // Create a new express router

//routes are protected by the protectRoute middleware
router.get("/profile/:username", protectRoute, getUserProfile); // Route to get a user's profile
router.get("/suggested", protectRoute, getSuggestedUsers); // Route to get suggested users, 
router.post("/follow/:id", protectRoute, followUnfollowUser); // Route to follow/unfollow a user
router.post("/update", protectRoute, updateUser); // Route to update the current user's profile

export default router; // Export the router to be used in other parts of the application
