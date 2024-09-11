import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => { // Added 'next' parameter
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
    next();
  } catch (err) {
    console.error("Error in verifyToken:", err);
    res.status(500).json({ message: "Invalid Token" });
  }
};

//import to every router needed in
/*
Where should the expire time be??
process.env.JWT_TOKEN, {expiresIn: 3600});
*/