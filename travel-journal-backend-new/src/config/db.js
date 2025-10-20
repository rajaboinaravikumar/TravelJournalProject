// src/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();



const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/travel', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

module.exports = connectDB;

