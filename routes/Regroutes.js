const express = require("express");
const User = require("../models/user"); // Import the User model
const connectDB = require("../config/db");
const router = express.Router();
connectDB(); // Connect to MongoDB

// User registration route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate the incoming request
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  try {
    // Save the new user to the database without hashing the password
    const newUser = await User.create({
      username,
      password, // Storing the password in plain text (not recommended)
    });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "An error occurred while registering the user" });
  }
});

module.exports = router;
