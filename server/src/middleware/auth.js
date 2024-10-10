import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
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
    req.role = verified;
    next();
  } catch (err) {
    console.error("Error in verifyToken:", err);
    res.status(500).json({ message: "Invalid Token" });
  }
};

/* OR this: ???
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};
*/