import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // Using memory storage for buffer access
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});
