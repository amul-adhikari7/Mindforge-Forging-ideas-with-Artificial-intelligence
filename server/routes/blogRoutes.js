import express from "express";
import { verifyToken as auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
import {
  addBlog,
  addComments,
  deleteBlogsById,
  getAllBlogs,
  getBlogComments,
  getBlogsById,
  togglePublish,
  generateContent,
  getBlogsByUser,
} from "../controllers/blogController.js";
const blogRouter = express.Router();

// Public routes
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogsById);
blogRouter.post("/add-comment", addComments);
blogRouter.post("/comments", getBlogComments);

// Protected routes - only admin and author can create blogs
blogRouter.post(
  "/add",
  upload.single("image"),
  auth,
  authorizeRoles("admin", "author"),
  addBlog
);

// Protected routes - only admin and author can delete/publish
blogRouter.post(
  "/delete",
  auth,
  authorizeRoles("admin", "author"),
  deleteBlogsById
);
blogRouter.post(
  "/toggle-publish",
  auth,
  authorizeRoles("admin", "author"),
  togglePublish
);

// Generate content - only admin and author
blogRouter.post(
  "/generate",
  auth,
  authorizeRoles("admin", "author"),
  generateContent
);

// Get blogs by user ID
blogRouter.get("/user/:userId", getBlogsByUser);

export default blogRouter;
