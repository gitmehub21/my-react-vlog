// backend/routes/post.routes.js

const express = require('express');

const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

/* ================= GET ALL POSTS (PUBLIC) ================= */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET SINGLE POST ================= */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name profilePic'
    );

    if (!post || post.status === 'removed') {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= CREATE POST ================= */
router.post(
  '/',
  protect,
  memberOrAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, body } = req.body;
      const image = req.file ? req.file.filename : '';

      const post = await Post.create({
        title,
        body,
        image,
        author: req.user._id,
        status: 'published',
      });

      await post.populate('author', 'name profilePic');

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= UPDATE POST ================= */
router.put(
  '/:id',
  protect,
  memberOrAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const isOwner = post.author.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      if (req.body.title) post.title = req.body.title;
      if (req.body.body) post.body = req.body.body;
      if (req.file) post.image = req.file.filename;

      await post.save();

      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= DELETE POST ================= */
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= ❤️ REACT ROUTE =================
router.post("/:id/react", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    if (!post.reactions) post.reactions = [];

    const alreadyReacted = post.reactions.some(
      (id) => id.toString() === userId
    );

    if (alreadyReacted) {
      post.reactions = post.reactions.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.reactions.push(req.user._id);
    }

    await post.save();

    res.json({ reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= 💬 COMMENT ROUTE =================
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    if (!post.comments) post.comments = [];

    post.comments.push(comment);

    await post.save();

    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;