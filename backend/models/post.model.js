import mongoose from "mongoose"; // Import the mongoose module

// Define the post schema
const postSchema = new mongoose.Schema({
    user: { // The user who created the post
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // This field is required
    },
    text: { // The text content of the post
        type: String,
    },
    img: { // The image URL of the post
        type: String
    },
    likes: [ // Array of users who liked the post
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
        }
    ],
    comments: [ // Array of comments on the post
        {
            text: { // The text content of the comment
                type: String,
                required: true, // This field is required
                trim: true // Trim whitespace from the beginning and end
            },
            user: { // The user who made the comment
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to the User model
                required: true // This field is required
            }
        }
    ],
}, { timestamps: true }); // Add createdAt and updatedAt fields

// Create the Post model from the schema
const Post = mongoose.model("Post", postSchema);

export default Post; // Export the Post model
