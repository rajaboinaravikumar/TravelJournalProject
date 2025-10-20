// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { firstName, email, password, confirmPassword } = req.body;

        // Validate input
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                error: 'Passwords do not match' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            firstName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id }, 
            'sruthi', 
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                email: newUser.email,
                profileImage: newUser.profileImage,
                profilePhoto: newUser.profilePhoto
            }, 
            token 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error during signup',
            details: error.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            'sruthi', 
            { expiresIn: '7d' }
        );

        res.json({ 
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                profileImage: user.profileImage,
                profilePhoto: user.profilePhoto
            }, 
            token 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error during login',
            details: error.message 
        });
    }
};