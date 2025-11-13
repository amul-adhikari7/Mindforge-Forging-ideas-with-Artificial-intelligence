import express from "express";
import { verifyToken as auth } from "../middlewares/auth.js";
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
} from "../controllers/blogController.js";
const blogRouter = express.Router();
blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogsById);
blogRouter.post("/delete", auth, deleteBlogsById);
blogRouter.post("/toggle-publish", auth, togglePublish);

//comments api
blogRouter.post("/add-comment", addComments);
blogRouter.post("/comments", getBlogComments);

//generate-api
blogRouter.post("/generate", auth, generateContent);

export default blogRouter;
