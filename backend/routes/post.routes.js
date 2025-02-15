import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createPost, deletePost, commentOnPost } from "../controllers/post.controller.js"

const router = express.Router();


router.post("/create", protectRoute, createPost);
// router.delete("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;