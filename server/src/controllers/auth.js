import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try{
      const {
        firstName,
        lastName,
        email,
        password,
        friends,
    } = req.body;

        const picturePath = req.file ? req.file.filename : null;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error("Registration error:", err); // Add this line for debugging
        res.status(500).json({ error: err.message });
    }
}

/* LOG IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email });
        if (!user || user === undefined) return res.status(400).json({ msg: "User dont exist. " });
        console.log("User", user); //test
        console.log("Incoming password", password); //test
        console.log("User password", user.password); //test

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
        console.log("Is it match?", isMatch); // test
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        console.log("Token?", token); //test
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
}


/* try {
        const { email, password } = req.body;
        //Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log(`Login attempt failed: User not found for email ${email}`);
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login attempt failed: Invalid password for email ${email}`);
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Remove password from user object
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Send response
        res.status(200).json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "An error occurred during login. Please try again." });
    } */