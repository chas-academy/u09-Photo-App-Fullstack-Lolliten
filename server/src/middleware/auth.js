import jwt from "jsonwebtoken";

// Middleware to verify token and check roles
export const verifyToken = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      let token = req.header("Authorization");

      if (!token) {
        return res.status(403).send("Access denied!");
      }

      if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);

      req.user = verified;

      // Set user role
      req.role = verified.role; // Ensure you set the role from the verified token

      // Check if the user's role is in the allowed roles
      if (allowedRoles.length && !allowedRoles.includes(req.role)) {
        return res.status(403).send("Access denied! Insufficient permissions.");
      }

      next();
    } catch (err) {
      console.error("Error in verifyToken:", err);
      res.status(500).json({ message: "Invalid Token" });
    }
  };
};
