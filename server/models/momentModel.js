import mongoose from "mongoose";

const momentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    aiCaption: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String, // Store admin email
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Moment", momentSchema);
