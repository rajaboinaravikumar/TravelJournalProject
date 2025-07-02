// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route example
router.get('/me', authMiddleware, (req, res) => {
    res.json(req.user);
});

module.exports = router;