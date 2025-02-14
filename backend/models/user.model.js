import mongoose from "mongoose"; // Importing the mongoose library to interact with MongoDB
import bcrypt from "bcryptjs"; // Importing the bcryptjs library to hash passwords
import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library to generate JWT tokens

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

// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) { // Check if the password is modified or if the document is new
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash the password using the salt
    }
    next(); // Call the next middleware
});

// Method to generate a JWT token for the user
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_Secret, { // Generate a JWT token with the user ID as payload
        expiresIn: "15d" // The token expires in 15 days
    });
};

// Creating the User model from the schema
const User = mongoose.model("User", userSchema);

// Exporting the User model to be used in other parts of the application
export default User;
