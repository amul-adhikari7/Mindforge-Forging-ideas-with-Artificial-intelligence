import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

// Debug endpoint: returns current user info if token is valid
authRouter.get("/me", verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
    message: "Token is valid",
  });
});

export default authRouter;
