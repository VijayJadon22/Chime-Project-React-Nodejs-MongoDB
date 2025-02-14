import { v2 as cloudinary } from "cloudinary"; // Importing Cloudinary library for image uploads

import Notification from "../models/notification.model.js"; // Importing the Notification model
import User from "../models/user.model.js"; // Importing the User model

// Controller function to get a user's profile based on their username
export const getUserProfile = async (req, res) => {
    const { username } = req.params; // Extracting the username from the request parameters
    try {
        // Finding the user by their username and excluding the password field
        const user = await User.findOne({ username }).select("-password");
        if (!user) { // If the user is not found, return a 404 error response
            return res.status(404).json({ error: "User not found" });
        }
        // If the user is found, return the user data as a JSON response
        res.status(200).json(user);
    } catch (error) { // If an error occurs, log it and return a 500 error response
        console.error("Error in getUserProfile controller: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Controller function to handle following or unfollowing a user
export const followUnfollowUser = async (req, res) => {
    const { id } = req.params; // Extracting the user ID to be followed/unfollowed from the request parameters

    try {
        // Finding the user to be modified (followed/unfollowed) by their ID
        const userToModify = await User.findById(id);
        if (!userToModify) {
            return res.status(404).json({ error: "User not found" }); // If the user is not found, return a 404 error response
        }

        // Finding the current logged-in user and excluding the password field
        const currentUser = await User.findById(req.user._id).select("-password");

        // Prevent the user from following/unfollowing themselves
        if (id == req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        // Check if the current user is already following the user to be modified
        const isCurrentUserFollowing = currentUser.following.includes(id);

        if (isCurrentUserFollowing) {
            // If the current user is already following, unfollow the user
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // If the current user is not following, follow the user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

            // Create a follow notification
            const notification = new Notification({
                from: req.user._id, // ID of the user who initiated the follow
                to: id, // ID of the user being followed
                type: "follow", // Type of notification
            });

            await notification.save(); // Save the notification
            //TODO: Add any additional logic for sending notifications
            return res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error("Error in followUnfollowUser controller: ", error);
        return res.status(500).json({ error: "Internal server error" }); // If an error occurs, return a 500 error response
    }
}

// Controller function to get suggested users
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id; // Retrieve the ID of the current logged-in user

        // Find the list of users that the current user is following
        const usersFollowedByMe = await User.findById(userId).select("following");

        // Aggregate query to find random users excluding the current user
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId } // Exclude the current user from the results ne=not equal
                },
            },
            { $sample: { size: 10 } }, // Randomly select 10 users
        ]);

        // Filter out users that the current user is already following
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));

        // Select the top 4 users from the filtered list
        const suggestedUsers = filteredUsers.slice(0, 4);

        // Remove the password field from the suggested users
        suggestedUsers.map(user => user.password = null);

        // Return the suggested users as a JSON response
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error("Error in getSuggestedUsers controller: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Controller function to update the user's profile
export const updateUser = async (req, res) => {
    const userId = req.user._id; // Retrieve the ID of the current logged-in user
    const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        // If the user is not found, return a 404 error response
        if (!user) return res.status(404).json({ error: "User not found" }); 

        // Ensure both current and new passwords are provided if password change is requested
        if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        // Check if current password matches before setting the new password
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword); // Compare the current password
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" }); // If the current password is incorrect, return a 400 error response
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" }); // If the new password is too short, return a 400 error response
            }
        }

        // If a new profile image is provided, delete the old one and upload the new one
        if (profileImg) {
            if (user.profileImg) {
                // Delete the old profile image from Cloudinary
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]); 
            }
            // Upload the new profile image
            const uploadedResponse = await cloudinary.uploader.upload(profileImg); 
            profileImg = uploadedResponse.secure_url; // Get the URL of the new profile image
        }

        // If a new cover image is provided, delete the old one and upload the new one
        if (coverImg) {
            if (user.coverImg) {
                // Delete the old cover image from Cloudinary
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]); 
            }
            // Upload the new cover image
            const uploadedResponse = await cloudinary.uploader.upload(coverImg); 
            coverImg = uploadedResponse.secure_url; // Get the URL of the new cover image
        }

        // Update user fields with the new data, or keep existing data if not provided
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        // Update the password only if a new password is provided
        if (newPassword) {
            user.password = newPassword;
        }

        // Save the updated user document to the database
        let updatedUser = await user.save();
        updatedUser.password = null; // Ensure the password is not included in the response

        // Return the updated user data as a JSON response
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateUserProfile controller: ", error);
        return res.status(500).json({ error: "Internal server error" }); // If an error occurs, return a 500 error response
    }
}
