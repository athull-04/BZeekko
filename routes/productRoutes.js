const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");
const Product = require("../models/product"); // Import the Product model
connectDB(); // Connect to MongoDB

// Middleware to verify Admin user
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

// POST route to add a product
router.post("/", verifyAdmin, async (req, res) => {
  const { name, description, price, image, category } = req.body;

  // Validate the required fields
  if (!name || !description || !price || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
  
    const newProduct = new Product({ name, description, price, image, category });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving product', error: err.message });
  }
});

// GET route to get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// GET route to get a single product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Fetch product by ID from MongoDB
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

// PUT route to update a product by id
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

// DELETE route to delete a product by id
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id); // Delete product by ID from MongoDB
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

module.exports = router;
