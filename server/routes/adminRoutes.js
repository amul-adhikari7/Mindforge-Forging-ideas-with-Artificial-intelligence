import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Public route
adminRouter.post("/login", adminLogin);

// Protected admin routes
adminRouter.get(
  "/comments",
  verifyToken,
  authorizeRoles("admin"),
  getAllComments
);
adminRouter.get(
  "/blogs",
  verifyToken,
  authorizeRoles("admin"),
  getAllBlogsAdmin
);
adminRouter.post(
  "/delete-comment",
  verifyToken,
  authorizeRoles("admin"),
  deleteCommentById
);
adminRouter.post(
  "/approve-comment",
  verifyToken,
  authorizeRoles("admin"),
  approveCommentById
);
adminRouter.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("admin"),
  getDashboard
);

export default adminRouter;
