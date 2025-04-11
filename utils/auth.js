const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "1h" }
  );
};

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};

module.exports = { generateToken, authenticate, authorizeAdmin };
