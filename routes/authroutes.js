const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Example admin credentials (in a real app, fetch from a database)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password"; // In a real app, use bcrypt to hash passwords

// POST /login route to authenticate the admin
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if credentials match the admin credentials (for simplicity, we hardcode them)
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Create a JWT token with an "admin" role
    const token = jwt.sign(
      { username, role: "admin" },
      "your-secret-key", // Secret key for JWT signing
      { expiresIn: "1h" } // Set the token to expire in 1 hour
    );

    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});
// Verify Admin Middleware to check the token
const verifyAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, "your-secret-key");
      req.user = decoded;
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
  

module.exports = router;
