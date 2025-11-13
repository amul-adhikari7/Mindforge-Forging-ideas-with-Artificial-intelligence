import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  getMoments,
  createMoment,
  deleteMoment,
} from "../controllers/momentController.js";

const router = express.Router();

// Get all moments
router.get("/", getMoments);

// Create a new moment (protected route)
router.post("/", verifyToken, upload.single("image"), createMoment);

// Delete a moment (protected route)
router.delete("/:id", verifyToken, deleteMoment);

export default router;
