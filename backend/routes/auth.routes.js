// backend/routes/auth.routes.js
const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* ── JWT ───────────────────────────── */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "member",
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ message: "Account deactivated" });
    }

    const match = await user.matchPassword(password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ME ================= */
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

/* ================= UPDATE PROFILE (FIXED CLEAN) ================= */
router.put(
  "/profile",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;

      if (req.file) {
        user.profilePic = req.file.filename;
      }

      await user.save();

      const updated = await User.findById(user._id).select("-password");

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= CHANGE PASSWORD ================= */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const match = await user.matchPassword(currentPassword);

    if (!match) {
      return res.status(400).json({ message: "Wrong current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;