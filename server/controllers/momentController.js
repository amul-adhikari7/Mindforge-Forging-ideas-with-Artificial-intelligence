import Moment from "../models/momentModel.js";
import { imagekit } from "../configs/imageKit.js";
import main from "../configs/gemini.js";

// Get all moments
export const getMoments = async (req, res) => {
  try {
    const moments = await Moment.find().sort({ date: -1 }).lean(); // No .populate()

    res.status(200).json(moments);
  } catch (error) {
    console.error("Error fetching moments:", error); // Add logging
    res.status(500).json({ message: "Error fetching moments" });
  }
};

// Create a new moment
export const createMoment = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const file = req.file;

    // Validate required fields
    if (!title || !description || !date) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (!file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // FIX: Check for email instead of id
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Upload image to ImageKit
    let imageUrl;
    try {
      const response = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `moment-${Date.now()}-${file.originalname}`,
        folder: "/moments",
      });
      imageUrl = response.url;
    } catch (error) {
      console.error("ImageKit Upload Error:", error);
      return res.status(500).json({ message: "Error uploading image" });
    }

    const moment = new Moment({
      title,
      description,
      image: imageUrl,
      date: new Date(date),
      createdBy: req.user.email, // Store email
    });

    const savedMoment = await moment.save();
    res.status(201).json(savedMoment);
  } catch (error) {
    console.error("Error creating moment:", error);
    res.status(500).json({ message: "Error creating moment" });
  }
};

// Delete a moment
export const deleteMoment = async (req, res) => {
  try {
    const moment = await Moment.findById(req.params.id);
    if (!moment) {
      return res.status(404).json({ message: "Moment not found" });
    }

    // Allow any admin to delete any moment
    // (removed createdBy check)

    await moment.deleteOne();
    res.status(200).json({ message: "Moment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
