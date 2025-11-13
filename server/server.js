import express from "express";
import "dotenv/config";
import cors from "cors";
import { EventEmitter } from "events";
import connectDb from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import momentRouter from "./routes/momentRoutes.js";

// Increase EventEmitter limit
EventEmitter.defaultMaxListeners = 15;

const app = express();
connectDb();
//Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working fine");
});
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/moments", momentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
});

export default app;
