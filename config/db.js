// db.js
const mongoose = require('mongoose');

// MongoDB connection URI (replace with your actual MongoDB URI)
const dbURI = 'mongodb+srv://AzTee:pass@aztee.56dsi.mongodb.net/'; // Local MongoDB instance
// Or if using MongoDB Atlas: 'mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>'

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
