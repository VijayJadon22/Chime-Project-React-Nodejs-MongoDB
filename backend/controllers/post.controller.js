import { v2 as cloudinary } from "cloudinary";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";


export const createPost = async (req, res) => {
    try {
        // Extract text and img from the request body
        const { text } = req.body;
        let { img } = req.body;
        // Get the userId from the request user object
        const userId = req.user._id.toString();

        // Find the user by their ID
        const user = await User.findById(req.user._id);
        // If user is not found, return a 404 Not Found error
        if (!user) return res.status(404).json({ error: "User not found" });

        // If both text and img are not provided, return a 400 Bad Request error
        if (!text && !img) {
            return res.status(400).json({ error: "Text or image is required" });
        }

        // If img is provided, upload it to Cloudinary
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            // Set img to the secure URL of the uploaded image
            img = uploadedResponse.secure_url;
        }
        // Create a new post with the user ID, text, and img
        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        // Save the new post to the database
        await newPost.save();
        // Return the newly created post with a 201 Created status
        return res.status(201).json(newPost);

    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in createPost controller: ", error);
        // Return a 500 Internal Server Error status with an error message
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        // Extract the postId from the request parameters
        const postId = req.params.id;

        // Find the post by its ID
        const post = await Post.findById(postId);

        // If the post is not found, return a 404 Not Found error
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Check if the user making the request is the owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            // If the user is not authorized, return a 401 Unauthorized error
            return res.status(401).json({ error: "Unauthorized to delete this post" });
        }

        // If the post has an associated image, delete the image from Cloudinary
        if (post.img) {
            // Extract the image ID from the image URL
            const imgId = post.img.split("/").pop().split(".")[0];
            // Delete the image from Cloudinary using the extracted image ID
            await cloudinary.uploader.destroy(imgId);
        }

        // Delete the post from the database by its ID
        await Post.findByIdAndDelete(postId);

        // Return a success message with a 200 status code
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in deletePost controller: ", error);
        // Return a 500 Internal Server Error status with an error message
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id; //postId
        const { text } = req.body;
        const userId = req.user._id;

        if (!text) return res.status(400).json({ error: "Text is required" });
        if (!postId) return res.status(400).json({ error: "Post ID is required" });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const comment = { user: userId, text };

        post.comments.push(comment);
        await post.save();
        return res.status(200).json(post);

    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in commentOnPost controller: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const userLikePost = post.likes.includes(userId);
        if (userLikePost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });

            //also send notification to the post creator or user
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });

            await notification.save();
            return res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in likeUnlikePost controller: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
