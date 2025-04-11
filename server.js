const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authroutes");  // Import auth routes
const productRoutes = require("./routes/productRoutes"); // Import product routes
const userAuth = require("./routes/userAuth"); // Import user auth routes
const Regroutes = require("./routes/Regroutes");
const profileRoutes = require("./routes/profileRoutes") // Import user registration routes
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (or specify frontend origin)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Use auth routes for authentication (login)
app.use("/api/auth/admin", authRoutes); // This sets the base route for auth routes
app.use("/api/auth/user", userAuth); 
app.use("/api/auth", Regroutes);
app.use("/api/auth", profileRoutes);
// Use product routes for product management
app.use("/api/products", productRoutes);

// Start the backend server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
