// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Check if authorization header exists
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'No authorization header' 
            });
        }

        // Extract token
        const token = authHeader.replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            throw new Error();
        }

        // Attach user to request
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Please authenticate' 
        });
    }
};

module.exports = authMiddleware;