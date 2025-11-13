import express from "express";
import "dotenv/config";
import cors from "cors";
import { EventEmitter } from "events";
import connectDb from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import momentRouter from "./routes/momentRoutes.js";

// Increase EventEmitter limit
EventEmitter.defaultMaxListeners = 15;

const app = express();

// Connect to MongoDB first
console.log("🔄 Connecting to MongoDB...");
await connectDb();

// CORS Configuration - Allow requests from Vite dev server and production
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Fallback if frontend is on different port
  process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working fine");
});

// Auth routes
app.use("/api/auth", authRouter);

// Existing routes
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/moments", momentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for origins:`, allowedOrigins);
  console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
