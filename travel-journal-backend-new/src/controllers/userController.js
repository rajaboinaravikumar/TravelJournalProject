// src/controllers/userController.js
const User = require('../models/User');
const Journal = require('../models/Journal');
const fs = require('fs');
const path = require('path');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error retrieving user profile',
            details: error.message 
        });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, email, profileImage, bio, location } = req.body;

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (email) updateFields.email = email;
        if (profileImage) updateFields.profileImage = profileImage;
        if (bio) updateFields.bio = bio;
        if (location) updateFields.location = location;

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            updateFields, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error updating user profile',
            details: error.message 
        });
    }
};

exports.updateProfilePhoto = async (req, res) => {
    try {
        console.log('updateProfilePhoto called with file:', req.file);
        console.log('User ID:', req.user.id);
        
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ 
                error: 'No file uploaded' 
            });
        }

        // Get the current user to check if they have an existing profile photo
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            console.log('User not found');
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        console.log('Current user profile photo:', currentUser.profilePhoto);

        // If user has an existing profile photo, delete it from the server
        if (currentUser.profilePhoto) {
            const oldPhotoPath = path.join(__dirname, '../../uploads', path.basename(currentUser.profilePhoto));
            console.log('Old photo path:', oldPhotoPath);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
                console.log('Old photo deleted');
            }
        }

        // Create the file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('New file URL:', fileUrl);

        // Update the user's profile photo
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { 
                profilePhoto: fileUrl,
                profileImage: fileUrl // Also save as profileImage for frontend compatibility
            },
            { new: true, runValidators: true }
        ).select('-password');

        console.log('Updated user:', user);

        res.json({
            message: 'Profile photo updated successfully',
            user: {
                ...user.toObject(),
                profileImage: user.profilePhoto // Add this for frontend compatibility
            }
        });
    } catch (error) {
        console.error('Error in updateProfilePhoto:', error);
        res.status(500).json({ 
            error: 'Server error updating profile photo',
            details: error.message 
        });
    }
};

exports.getFollowingUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('following', 'firstName email profileImage profilePhoto bio')
            .select('-password');

        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        // Get journal count for each following user
        const followingWithJournalCount = await Promise.all(
            user.following.map(async (followedUser) => {
                const journalCount = await Journal.countDocuments({ user: followedUser._id });
                return {
                    _id: followedUser._id,
                    firstName: followedUser.firstName,
                    email: followedUser.email,
                    profileImage: followedUser.profileImage,
                    profilePhoto: followedUser.profilePhoto,
                    bio: followedUser.bio,
                    journalCount: journalCount,
                    followerCount: followedUser.followers ? followedUser.followers.length : 0
                };
            })
        );

        res.json(followingWithJournalCount);
    } catch (error) {
        console.error('Error fetching following users:', error);
        res.status(500).json({ 
            error: 'Server error retrieving following users',
            details: error.message 
        });
    }
};

exports.followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        // Check if user is trying to follow themselves
        if (userId === currentUserId) {
            return res.status(400).json({ 
                error: 'You cannot follow yourself' 
            });
        }

        // Check if the user to follow exists
        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ 
                error: 'User to follow not found' 
            });
        }

        // Check if already following
        const currentUser = await User.findById(currentUserId);
        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ 
                error: 'Already following this user' 
            });
        }

        // Add to following list
        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { following: userId }
        });

        // Add to user's followers list
        await User.findByIdAndUpdate(userId, {
            $addToSet: { followers: currentUserId }
        });

        res.json({ 
            message: 'Successfully followed user' 
        });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ 
            error: 'Server error following user',
            details: error.message 
        });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        // Check if the user to unfollow exists
        const userToUnfollow = await User.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ 
                error: 'User to unfollow not found' 
            });
        }

        // Remove from following list
        await User.findByIdAndUpdate(currentUserId, {
            $pull: { following: userId }
        });

        // Remove from user's followers list
        await User.findByIdAndUpdate(userId, {
            $pull: { followers: currentUserId }
        });

        res.json({ 
            message: 'Successfully unfollowed user' 
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ 
            error: 'Server error unfollowing user',
            details: error.message 
        });
    }
};

exports.getAllJournals = async (req, res) => {
  try {
    // Get all journals with user information
    const journals = await Journal.find()
      .populate('user', 'firstName email profileImage profilePhoto')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent performance issues

    // Return the full journal objects (with populated user)
    res.json(journals);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving journals",
      details: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user", details: error.message });
  }
};