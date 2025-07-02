// src/models/Journal.js
const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: {
        type: String,
        trim: true,
        default: null
    },
    location: { 
        type: String, 
        required: [true, 'Location is required'],
        trim: true
    },
    images: [{ 
        type: String 
    }],
    tags: [{ 
        type: String,
        trim: true
    }],
    friendsMentioned: [{ 
        type: String,
        trim: true
    }],
    entry: { 
        type: String, 
        required: [true, 'Journal entry is required'],
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4.5
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    isPublic: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// Virtual for image URLs if needed
JournalSchema.virtual('imageUrls').get(function() {
    return this.images.map(img => `${process.env.APP_URL}/uploads/${img}`);
});

// Virtual for like count
JournalSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Virtual for comment count
JournalSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

module.exports = mongoose.model('Journal', JournalSchema);