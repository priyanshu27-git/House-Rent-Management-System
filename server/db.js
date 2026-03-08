import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Default to local MongoDB if the .env variable is missing
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.trim() === "") {
  MONGODB_URI = "mongodb://localhost:27017/househunt";
}

/**
 * initDB handles the initial connection to MongoDB.
 * It's called in your main index.js before starting the server.
 */
export async function initDB() {
  console.log("⏳ Attempting to connect to MongoDB...");
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("✅ Connected to MongoDB successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️  Server will continue to start, but database features may be unavailable.");
  }
}

// Listen for connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("🚨 MongoDB runtime error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 MongoDB disconnected.");
});

export default mongoose.connection;