const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// ✅ Use same secret key
const ACCESS_TOKEN_SECRET = 'your-secret-key';

// ✅ Middleware to verify access token and check role
const verifyUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;

    // ✅ Check role (optional for profile, but good practice)
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Protected Profile Route
router.get('/profile', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
      joinDate: user.joinDate,
      profilePicture: user.profilePicture,
      orders: user.orders || [],
    });
  } catch (err) {
    console.error('❌ Profile fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
