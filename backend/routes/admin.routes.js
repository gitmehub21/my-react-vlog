const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");
const { protect } = require("../middleware/auth.middleware");

// 🔐 Admin middleware
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

/* ================= GET USERS ================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= TOGGLE USER STATUS ================= */
router.put("/users/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET POSTS ================= */
router.get("/posts", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find({ status: { $ne: "removed" } })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= REMOVE POST ================= */
router.put("/posts/:id/remove", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.status = "removed";
    await post.save();

    res.json({ message: "Post removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;