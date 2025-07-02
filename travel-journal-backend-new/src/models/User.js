// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            'Please fill a valid email address'
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    profilePhoto: {
        type: String,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: 'Travel enthusiast sharing adventures around the world',
        maxlength: [200, 'Bio cannot exceed 200 characters']
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true, 
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    }
});

// Virtual for follower count
UserSchema.virtual('followerCount').get(function() {
    return this.followers.length;
});

// Virtual for following count
UserSchema.virtual('followingCount').get(function() {
    return this.following.length;
});

module.exports = mongoose.model('User', UserSchema);