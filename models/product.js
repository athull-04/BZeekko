const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  category: { type: String, required: true }, 
});

// Create and export the Product model
module.exports = mongoose.model('Product', productSchema);
