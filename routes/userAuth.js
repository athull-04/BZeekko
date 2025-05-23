const express = require("express");
const User = require("../models/user"); // Import the User model
const connectDB = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
connectDB();

// Middleware to verify the user role and check if the token is valid for user
const verifyUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.user = decoded;

    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// User login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Search for the user in the database
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid Username" });
    }

    // Compare the provided password directly with the stored password (plain text)
    if (password !== foundUser.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token if the passwords match
    const token = jwt.sign({ username, role: "user" }, "your-secret-key", { expiresIn: "1h" });

    return res.json({ token });

  } catch (err) {
    console.error("Login error:", err);  // Log the error to server console
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/reg", async (req, res) => {
  console.log("📥 Register route hit");
  console.log("➡️ Request body:", req.body);

  const { username, password } = req.body;

  // Step 1: Validate request
  if (!username || !password) {
    console.log("❌ Missing username or password");
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Step 2: Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ Username already exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    // Step 3: Create new user
    const newUser = await User.create({ username, password });
    console.log("✅ User created:", newUser);

    return res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("💥 Error during registration:", error);
    return res.status(500).json({ message: "An error occurred while registering the user" });
  }
});



// User-specific route
router.get("/user-dashboard", verifyUser, (req, res) => {
  res.send("Welcome to the User Dashboard!");
});



module.exports = router;
