import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log(
      `🔌 Connecting to MongoDB at ${
        process.env.MONGODB_URI.split("@")[1] || "localhost"
      }...`
    );

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");

    // Optional: Handle disconnection events
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("💡 Make sure MONGODB_URI is set in your .env file");
    process.exit(1); // Exit if DB connection fails
  }
};

export default connectDB;
