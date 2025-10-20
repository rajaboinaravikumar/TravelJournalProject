const Journal = require("../models/Journal");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

console.log("✅ Backend server started and logging is working!");

exports.createJournal = async (req, res) => {
  try {
    const { title, location, tags, friendsMentioned, entry } = req.body;

    // Process uploaded images and sanitize paths
    const images = req.files
      ? req.files.map((file) => `uploads/${file.filename.replace(/\\/g, "/")}`)
      : [];

    const newJournal = new Journal({
      title,
      user: req.user.id,
      location,
      images,
      tags: tags ? tags.split(",") : [],
      friendsMentioned: friendsMentioned ? friendsMentioned.split(",") : [],
      entry,
    });

    await newJournal.save();

    // Generate full image URLs
    const imageUrls = images.map(
      (imgPath) => `http://localhost:5000/${imgPath}`
    );

    res.status(201).json({
      ...newJournal._doc,
      imageUrls,
    });
  } catch (error) {
    res.status(400).json({
      error: "Error creating journal entry",
      details: error.message,
    });
  }
};

exports.getUserJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id })
      .populate("user", "firstName email profileImage profilePhoto")
      .sort({ createdAt: -1 });

    const transformedJournals = journals.map((journal) => ({
      _id: journal._id,
      title: journal.title || `Journey to ${journal.location}`,
      location: journal.location,
      images: journal.images,
      entry: journal.entry,
      tags: journal.tags,
      friendsMentioned: journal.friendsMentioned,
      createdAt: journal.createdAt,
      updatedAt: journal.updatedAt,
      user: journal.user
        ? {
            _id: journal.user._id,
            firstName: journal.user.firstName,
            email: journal.user.email,
            profileImage: journal.user.profileImage,
            profilePhoto: journal.user.profilePhoto,
          }
        : null,
      likes: Array.isArray(journal.likes) ? journal.likes.length : 0,
      comments: Array.isArray(journal.comments) ? journal.comments.length : 0,
      rating: journal.rating || 4.5,
    }));

    res.json(transformedJournals);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving journals",
      details: error.message,
    });
  }
};

exports.getJournalById = async (req, res) => {
  const { id } = req.params;

  console.log("📥 Received request for Journal ID:", id);

  if (!mongoose .Types.ObjectId.isValid(id)) {
    console.error("❌ Invalid Journal ID:", id);
    return res.status(400).json({ error: "Invalid journal ID" });
  }

  try {
    const journal = await Journal.findById(id)
      .populate("user", "firstName email profileImage profilePhoto")
      .populate("comments.user", "firstName email profileImage profilePhoto");

    if (!journal) {
      console.warn("⚠️ Journal not found for ID:", id);
      return res.status(404).json({ error: "Journal not found" });
    }

    const likes = Array.isArray(journal.likes) ? journal.likes.length : 0;
    const comments = Array.isArray(journal.comments) ? journal.comments.length : 0;

    res.json({ ...journal.toObject(), likes, comments });
  } catch (error) {
    console.error("🔥 Error retrieving journal:", error.message);
    res.status(500).json({
      error: "Error retrieving journal",
      details: error.message,
    });
  }
};

exports.shareJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.json({
      ...journal.toObject(),
      shareLink: `https://yourapp.com/share/${journal._id}`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error sharing journal",
      details: error.message,
    });
  }
};

exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    // Delete associated images
    for (const imagePath of journal.images) {
      const fullPath = path.resolve(__dirname, "..", imagePath);
      try {
        await fs.promises.unlink(fullPath);
        console.log("🗑️ Deleted image:", fullPath);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn("⚠️ Image not found, skipping:", fullPath);
        } else {
          console.error("❌ Error deleting image:", fullPath, err.message);
        }
      }
    }

    res.json({ message: "Journal deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Error deleting journal",
      details: error.message,
    });
  }
};

exports.getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find()
      .populate("user", "firstName email profileImage profilePhoto")
      .sort({ createdAt: -1 })
      .limit(50);

    const transformedJournals = journals.map((journal) => ({
      _id: journal._id,
      title: journal.title || `Journey to ${journal.location}`,
      location: journal.location,
      images: journal.images,
      entry: journal.entry,
      tags: journal.tags,
      friendsMentioned: journal.friendsMentioned,
      createdAt: journal.createdAt,
      updatedAt: journal.updatedAt,
      user: journal.user
        ? {
            _id: journal.user._id,
            firstName: journal.user.firstName,
            email: journal.user.email,
            profileImage: journal.user.profileImage,
            profilePhoto: journal.user.profilePhoto,
          }
        : null,
      likes: Array.isArray(journal.likes) ? journal.likes.length : 0,
      comments: Array.isArray(journal.comments) ? journal.comments.length : 0,
      rating: journal.rating || 4.5,
    }));

    res.json(transformedJournals);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving journals",
      details: error.message,
    });
  }
};

exports.likeJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ error: "Journal not found" });
    const userId = req.user.id;
    const index = journal.likes.indexOf(userId);
    if (index === -1) {
      journal.likes.push(userId);
    } else {
      journal.likes.splice(index, 1);
    }
    await journal.save();
    res.json({ likes: journal.likes.length });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to like/unlike journal", details: error.message });
  }
};

exports.commentJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ error: "Journal not found" });
    const comment = {
      user: req.user.id,
      text: req.body.text,
      createdAt: new Date(),
    };
    journal.comments.unshift(comment);
    await journal.save();
    res.json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add comment", details: error.message });
  }
};
