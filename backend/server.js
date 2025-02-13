import express from "express"; // Importing the Express library to create a web server
import dotenv from "dotenv"; // Importing the dotenv library to load environment variables from a .env file

import authRoutes from "./routes/auth.routes.js"; // Importing the authentication routes
import connectMongoDB from "./db/connectMongoDB.js"; // Importing the function to connect to MongoDB

dotenv.config(); // Loading environment variables from the .env file

const app = express(); // Creating an instance of the Express application
const PORT = process.env.PORT || 5000; // Defining the port number to listen on, using the value from the environment variable or 5000 as default

app.use(express.json()); // Middleware to parse incoming JSON requests

app.use("/api/auth", authRoutes); // Setting up the authentication routes with the base URL "/api/auth"

// Starting the server and listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`); // Logging the server start message
    connectMongoDB(); // Connecting to MongoDB when the server starts
});
