import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// Controller function to get notifications for the authenticated user
export const getNotifications = async (req, res) => {
    console.log("hello"); // Log a message for debugging purposes
    try {
        const userId = req.user._id; // Extract the user ID from the authenticated user

        // Find the user by their ID
        const user = await User.findById(userId);
        // If the user is not found, return a 404 error
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find notifications sent to the user and populate the "from" field with the sender's username and profile image
        const userNotifications = await Notification.find({ to: userId })
            .populate({ path: "from", select: "username profileImg" });

        // Mark the notifications as read
        await Notification.updateMany({ to: userId }, { read: true });

        // Return the notifications with a 200 success response
        return res.status(200).json(userNotifications);
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in getNotifications controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to delete all notifications for the authenticated user
export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Extract the user ID from the authenticated user

        // Find the user by their ID
        const user = await User.findById(userId);
        // If the user is not found, return a 404 error
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete all notifications sent to the user
        await Notification.deleteMany({ to: userId });

        // Return a success message with a 200 success response
        return res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in deleteNotifications controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to delete a single notification by its ID
export const deleteSingleNotification = async (req, res) => {
    try {
        const notificationId = req.params.id; // Extract the notification ID from the request parameters
        const userId = req.user._id; // Extract the user ID from the authenticated user

        // Find the notification by its ID
        const notification = await Notification.findById(notificationId);
        // If the notification is not found, return a 404 error
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        // Check if the notification belongs to the authenticated user
        if (notification.to.toString() !== userId.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this notification" });
        }

        // Delete the notification by its ID
        await Notification.findByIdAndDelete(notificationId);

        // Return a success message with a 200 success response
        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error in deleteNotifications controller: ", error);

        // Return a 500 internal server error response
        return res.status(500).json({ error: "Internal server error" });
    }
};
