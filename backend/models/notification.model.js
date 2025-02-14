import mongoose from "mongoose"; // Import the mongoose module

// Define the notification schema
const notificationSchema = new mongoose.Schema({
    from: { // The user who initiated the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // This field is required
    },
    to: { // The user who receives the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // This field is required
    },
    type: { // The type of notification
        type: String,
        required: true, // This field is required
        enum: ["follow", "like"] // Possible values: "follow" or "like"
    },
    read: { // Indicates whether the notification has been read
        type: Boolean,
        default: false // Default value is false
    }

}, { timestamps: true }); // Add createdAt and updatedAt fields

// Create the Notification model from the schema
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification; // Export the Notification model
