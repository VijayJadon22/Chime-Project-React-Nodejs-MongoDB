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

// Controller function to handle commenting on a post
export const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id; // Extracting the post ID from the request parameters
        const { text } = req.body; // Extracting the comment text from the request body
        const userId = req.user._id; // Extracting the user ID from the authenticated user

        // Validate if the comment text is provided
        if (!text) return res.status(400).json({ error: "Text is required" });
        // Validate if the post ID is provided
        if (!postId) return res.status(400).json({ error: "Post ID is required" });

        // Find the post by its ID
        const post = await Post.findById(postId);
        // If the post is not found, return a 404 error
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Create a new comment object with the user ID and comment text
        const comment = { user: userId, text };

        // Push the new comment into the comments array of the post
        post.comments.push(comment);
        // Save the updated post to the database
        await post.save();
        // Return the updated post as a response
        return res.status(200).json(post);

    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in commentOnPost controller: ", error);
        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
}


// Controller function to handle liking and unliking a post
export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id; // Extracting the post ID from the request parameters
        const userId = req.user._id; // Extracting the user ID from the authenticated user

        // Find the post by its ID
        const post = await Post.findById(postId);

        // If the post is not found, return a 404 error
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Check if the user has already liked the post
        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            // If the user has liked the post, remove their like
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // If the user hasn't liked the post, add their like
            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

            // Also send a notification to the post creator or user
            const notification = new Notification({
                from: userId, // The user who liked the post
                to: post.user, // The user who created the post
                type: "like", // The type of notification
            });

            // Save the notification to the database
            await notification.save();
            return res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in likeUnlikePost controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Controller function to handle retrieving all posts
export const getAllPosts = async (req, res) => {
    try {
        // Fetch all posts from the database and sort them in descending order based on the creation date
        const posts = await Post.find({}).sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" }) // Populate the user field, excluding the password
            .populate({ path: "comments.user", select: "username fullName profileImg" });
        // Populate the user field in comments with username, fullName, and profileImg

        // If no posts are found, return an empty array with a 200 status
        if (posts.length == 0) {
            return res.status(200).json([]);
        }

        // Return the retrieved posts with a 200 status
        return res.status(200).json(posts);
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in getAllPosts controller: ", error);
        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Controller function to get posts liked by a specific user
export const getLikedPosts = async (req, res) => {
    try {
        // Extract the userId from the request parameters
        const userId = req.params.id;

        // Find the user with the given userId
        const user = await User.findById(userId);

        // If the user is not found, return a 404 error response
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find the posts liked by the user, and populate the user field (excluding the password) 
        // and the comments' user field (excluding the password)
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });

        // Return the liked posts with a 200 success response
        return res.status(200).json(likedPosts);
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in getLikedPosts controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Controller function to get posts from users that the current user is following
export const getFollowingPosts = async (req, res) => {
    try {
        // Get the userId from the authenticated user's request
        const userId = req.user._id;

        // Find the user with the given userId
        const user = await User.findById(userId);

        // If the user is not found, return a 404 error response
        if (!user) return res.status(404).json({ error: "User not found" });

        // Get the list of users that the current user is following
        const followingUsers = user.following;

        // Find the posts created by the following users, sort them by creation date (newest first),
        // and populate the user field (excluding the password) and the comments' user field (excluding the password)
        const followingUsersPosts = await Post.find({ user: { $in: followingUsers } })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });

        // Return the following users' posts with a 200 success response
        return res.status(200).json(followingUsersPosts);
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in getFollowingPosts controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to get posts by a specific user
export const getUserPosts = async (req, res) => {
    try {
        // Extract the username from the request parameters
        const { username } = req.params;

        // Find the user with the given username
        const user = await User.findOne({ username });

        // If the user is not found, return a 404 error response
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find the posts created by the user, sort them by creation date (newest first),
        // and populate the user field (excluding the password) and the comments' user field (excluding the password)
        const userPosts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });

        // Return the user posts with a 200 success response
        return res.status(200).json(userPosts);
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in getUserPosts controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};


