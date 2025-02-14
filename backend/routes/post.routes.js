import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {createPost} from "../controllers/post.controller.js"

const router = express.Router();


router.post("/create", protectRoute, createPost);
// router.delete("/like/:id", protectRoute, likeUnlikePost);
// router.delete("/comment/:id", protectRoute, commentOnPost);
// router.delete("/delete", protectRoute, deletePost);

export default router;