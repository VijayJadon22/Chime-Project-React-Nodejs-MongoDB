// Import necessary modules and controllers
import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
    createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts
} from "../controllers/post.controller.js";

// Create a new Express router instance
const router = express.Router();

// routes for handling posts with the protectRoute middleware applied to each route
router.get("/all", protectRoute, getAllPosts); // Get all posts
router.get("/following", protectRoute, getFollowingPosts); // Get posts from users that the authenticated user is following
router.get("/user/:username", protectRoute, getUserPosts); // Get posts from a specific user by username
router.get("/likes/:id", protectRoute, getLikedPosts); // Get posts liked by a specific user
router.post("/create", protectRoute, createPost); // Create a new post
router.post("/like/:id", protectRoute, likeUnlikePost); // Like or unlike a post
router.post("/comment/:id", protectRoute, commentOnPost); // Comment on a post
router.delete("/:id", protectRoute, deletePost); // Delete a post by its ID

// Export the router to be used in the main application
export default router;
