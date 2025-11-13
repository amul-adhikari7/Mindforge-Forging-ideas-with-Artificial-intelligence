import "dotenv/config";
import jwt from "jsonwebtoken";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // 1️⃣ Validate inputs
    if (!email || !password) {
      console.log("Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check environment variables
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      console.error("Missing environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // 2️⃣ Verify credentials
    const isValidEmail = email === process.env.ADMIN_EMAIL;
    const isValidPassword = password === process.env.ADMIN_PASSWORD;

    if (!isValidEmail || !isValidPassword) {
      console.log("Invalid credentials for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Generate JWT with standard claims
    const token = jwt.sign(
      {
        email,
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60, // 2 hours
      },
      process.env.JWT_SECRET
    );

    console.log("Login successful for:", email);

    // 4️⃣ Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email,
        role: "admin",
      },
    });
  } catch (error) {
    // 5️⃣ Handle unexpected errors
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.error("Get all comments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      blogs,
      recentBlogs,
      comments,
      drafts,
      user: { email: req.user.email, role: req.user.role },
    };

    return res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "comment deleted sucessfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isPublished: true });
    res.json({ success: true, message: "comment approved sucessfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
