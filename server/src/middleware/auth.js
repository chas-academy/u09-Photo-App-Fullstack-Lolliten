import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => { //export makes verifyToken available in other modules
  try {
    let token = req.header("Authorization"); //extracts the authorization header from the incoming request.

    if (!token) {
      return res.status(403).send("Access denied!");
    }

    if (token.startWith("Bearer ")) {
      token = token.slice(7, token.lenght).trimLeft(); //The slice method is used to extract the actual token without the "Bearer " prefix.
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); //the secret key stored in .env
    req.user = verified; //If the verification is successful, the decoded user information is attached to the req.user property of the request object.
    next(); //next middleware function in the request handling chain. 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//import to every router needed in
/*
Where should the expire time be??
process.env.JWT_TOKEN, {expiresIn: 3600});
*/