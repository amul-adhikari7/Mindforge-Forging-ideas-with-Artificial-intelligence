import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Log request details
    console.log(`Authenticating ${req.method} ${req.path}`);
    console.log("Authorization header:", req.headers.authorization);

    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("No Authorization header");
      return res
        .status(401)
        .json({ success: false, message: "No authorization header" });
    }

    // Extract and validate token format
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      console.log("Invalid Authorization format");
      return res
        .status(401)
        .json({ success: false, message: "Invalid authorization format" });
    }

    console.log("Token found:", token.substring(0, 10) + "...");

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully:", {
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : "no expiration",
    });

    req.user = decoded;

    // Admin route check
    if (req.path.startsWith("/admin/") && decoded.role !== "admin") {
      console.log("Non-admin access attempt:", decoded.email);
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", {
      type: error.name,
      message: error.message,
      expiry: error.expiredAt
        ? new Date(error.expiredAt).toISOString()
        : undefined,
    });

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again.",
      code: error.name,
    });
  }
};
