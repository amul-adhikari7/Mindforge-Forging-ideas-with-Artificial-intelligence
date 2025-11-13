import jwt from "jsonwebtoken";

/**
 * Middleware: Verify JWT token
 * Attaches req.user with { id, email, role } on success
 * Returns 401 for missing/invalid tokens
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log(
        "[AUTH] Missing Authorization header on",
        req.method,
        req.path
      );
      return res.status(401).json({
        success: false,
        code: "no_token",
        message: "No authorization token provided. Please login first.",
        hint: "Add Authorization header: 'Bearer {token}'",
      });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      console.log(
        "[AUTH] Invalid Authorization format on",
        req.method,
        req.path
      );
      return res.status(401).json({
        success: false,
        code: "invalid_format",
        message: "Invalid authorization format.",
        hint: "Use: Authorization: Bearer {token}",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[ERROR] JWT_SECRET is missing");
      return res.status(500).json({
        success: false,
        code: "server_error",
        message: "Server configuration error.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request with required fields
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    console.log(
      `[AUTH] Token verified for ${decoded.email} (role: ${decoded.role})`
    );
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("[AUTH] Token expired on", req.method, req.path);
      return res.status(401).json({
        success: false,
        code: "token_expired",
        message: "Session expired. Please login again.",
      });
    }

    console.error(
      "[AUTH] Token verification failed:",
      error.name,
      error.message
    );
    return res.status(401).json({
      success: false,
      code: "invalid_token",
      message: "Invalid or malformed token. Please login again.",
    });
  }
};

/**
 * Middleware: Authorize by role
 * Returns 403 with clear JSON if user role doesn't match
 * @param {...string} allowedRoles - Role(s) allowed to access
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("[AUTH] No user object attached to request");
      return res.status(401).json({
        success: false,
        code: "no_user",
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log(
        `[AUTH] Access denied for ${req.user.email} (role: ${req.user.role}) trying to access ${req.method} ${req.path}`
      );
      return res.status(403).json({
        success: false,
        code: "forbidden",
        message: "Access denied. Admin privileges required.",
      });
    }

    console.log(
      `[AUTH] Access granted for ${req.user.email} to ${req.method} ${req.path}`
    );
    next();
  };
};
