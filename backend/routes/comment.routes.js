// backend/routes/comment.routes.js

const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');

/* ================= GET COMMENTS ================= */
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= CREATE COMMENT ================= */
router.post('/:postId', protect, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      postId: req.params.postId,
      userId: req.user._id,
      text,
    });

    const populated = await comment.populate('userId', 'name profilePic');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE COMMENT ================= */
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json({ message: 'Comment not found' });

    const isOwner = comment.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;