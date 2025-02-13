import mongoose from "mongoose"; // Importing the mongoose library to interact with MongoDB

// Function to connect to MongoDB
const connectMongoDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string stored in the environment variable MONGO_URI
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // If the connection is successful, log the host of the connected MongoDB server
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        // If there's an error during connection, log the error message
        console.log("Error connecting to MongoDB: ", error);
        // Exit the process with a failure code (1)
        process.exit(1);
    }
};

// Export the connectMongoDB function to be used in other parts of the application
export default connectMongoDB;
