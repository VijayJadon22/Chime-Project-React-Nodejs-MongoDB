import mongoose from "mongoose"; // Importing the mongoose library to interact with MongoDB

// Defining the schema for the user collection
const userSchema = new mongoose.Schema({
    username: { // Field for the user's username
        type: String, // The type of data for this field is String
        required: true, // This field is required and cannot be empty
        unique: true, // The username must be unique across all users
    },
    fullName: { // Field for the user's full name
        type: String, // The type of data for this field is String
        required: true, // This field is required and cannot be empty
    },
    email: { // Field for the user's email address
        type: String, // The type of data for this field is String
        required: true, // This field is required and cannot be empty
        unique: true, // The email must be unique across all users
    },
    password: { // Field for the user's password
        type: String, // The type of data for this field is String
        required: true, // This field is required and cannot be empty
        minLength: 6, // The password must have a minimum length of 6 characters
    },
    followers: [ // Array field for the list of users following this user
        {
            type: mongoose.Schema.Types.ObjectId, // Each follower is referenced by their unique ObjectId
            ref: "User", // The reference points to the User collection
            default: [] // The default value is an empty array
        }
    ],
    following: [ // Array field for the list of users this user is following
        {
            type: mongoose.Schema.Types.ObjectId, // Each following user is referenced by their unique ObjectId
            ref: "User", // The reference points to the User collection
            default: [] // The default value is an empty array
        }
    ],
    profileImg: { // Field for the URL of the user's profile image
        type: String, // The type of data for this field is String
        default: "", // The default value is an empty string
    },
    coverImg: { // Field for the URL of the user's cover image
        type: String, // The type of data for this field is String
        default: "", // The default value is an empty string
    },
    bio: { // Field for the user's biography or description
        type: String, // The type of data for this field is String
        default: "", // The default value is an empty string
    },
    link: { // Field for the user's personal or website link
        type: String, // The type of data for this field is String
        default: "", // The default value is an empty string
    }
}, { timestamps: true }); // The timestamps option adds createdAt and updatedAt fields to the schema

// Creating the User model from the schema
const User = mongoose.model("User", userSchema);
// Exporting the User model to be used in other parts of the application
export default User;
