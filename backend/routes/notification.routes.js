import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getNotifications, deleteNotifications, deleteSingleNotification } from "../controllers/notification.controller.js";

// Create a new Express router instance
const router = express.Router();

// routes for handling notifications with the protectRoute middleware applied to each route
router.get("/", protectRoute, getNotifications); // Get notifications for the authenticated user
router.delete("/", protectRoute, deleteNotifications); // Delete all notifications for the authenticated user
router.delete("/:id", protectRoute, deleteSingleNotification); // Delete a single notification by its ID for the authenticated user

// Export the router to be used in other parts of the application
export default router;
