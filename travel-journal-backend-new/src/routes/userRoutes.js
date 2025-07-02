// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile,
    updateProfilePhoto,
    getFollowingUsers,
    followUser,
    unfollowUser,
    getUserById
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/profile-image', authMiddleware, upload.single('profileImage'), updateProfilePhoto);

// Following routes
router.get('/following', authMiddleware, getFollowingUsers);
router.post('/follow/:userId', authMiddleware, followUser);
router.post('/unfollow/:userId', authMiddleware, unfollowUser);

router.get('/:userId', authMiddleware, getUserById);

module.exports = router;