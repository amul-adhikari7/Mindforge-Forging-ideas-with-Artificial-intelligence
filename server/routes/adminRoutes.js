import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
} from "../controllers/adminController.js";

const adminRouter = express.Router();
adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", verifyToken, getAllComments);
adminRouter.get("/blogs", verifyToken, getAllBlogsAdmin);
adminRouter.post("/delete-comment", verifyToken, deleteCommentById);
adminRouter.post("/approve-comment", verifyToken, approveCommentById);
adminRouter.get("/dashboard", verifyToken, getDashboard);

export default adminRouter;
