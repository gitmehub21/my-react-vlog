const express = require("express");
const router = express.Router();

const Message = require("../models/Message");

/* ================= CREATE MESSAGE ================= */
router.post("/", async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newMessage = await Message.create({
      fullName,
      email,
      message,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET ALL MESSAGES ================= */
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= TOGGLE READ/UNREAD ================= */
router.put("/:id/read", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);

    if (!msg) return res.status(404).json({ message: "Not found" });

    msg.isRead = !msg.isRead;
    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE MESSAGE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;