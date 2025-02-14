import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

// Public routes
router.post("/signup", signup); // Route for user signup
router.post("/login", login); // Route for user login
router.post("/logout", logout); // Route for user logout

// Secured route - requires protectRoute middleware
router.get("/me", protectRoute, getMe); // Route to get the current logged-in user's information

export default router;
