import fs from "fs";
import { imagekit } from "../configs/imageKit.js";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import main from "../configs/gemini.js";
export const addBlog = async (req, res) => {
  try {
    // Check if blog data exists
    if (!req.body.blog) {
      return res.status(400).json({
        success: false,
        message: "Missing blog data",
      });
    }

    // Parse blog data and handle JSON parsing errors
    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog data format",
      });
    }

    const { title, subTitle, description, category, isPublished } = blogData;
    const imgFile = req.file;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!subTitle) missingFields.push("subtitle");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    if (!imgFile) missingFields.push("image");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Use the buffer directly since we're using memory storage
    if (!imgFile.buffer) {
      return res.status(400).json({
        success: false,
        message: "Invalid image file: no data received",
      });
    }

    // Upload image to ImageKit with proper error handling
    let uploaded;
    try {
      uploaded = await imagekit.upload({
        file: imgFile.buffer,
        fileName: imgFile.originalname || `blog-image-${Date.now()}`,
        folder: "/blogs",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }

    // Optimize image URL with fallback values
    const optimizedImageUrl = imagekit.url({
      path: uploaded.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    // Get userId from authenticated user
    const userId = req.user?.id;
    const author = req.user?.name || "Anonymous";

    // Save blog to database
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
      userId,
      author,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogsById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const deleteBlogsById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, message: "blog status updated " });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addComments = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isPublished: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      `Create a detailed blog post about ${prompt} in simple words.`
    );

    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ userId });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
