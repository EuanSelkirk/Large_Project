import express from "express";
import Resume from "../model/resume.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

// Create a new resume
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, html, css } = req.body;
    const resume = new Resume({
      name,
      html,
      css,
      user: req.user.userId,
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    console.error("[RESUMES] save error:", err);
    res.status(400).json({ error: err.message });
  }
});

// List all resumes for the logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one resume by ID (only if it belongs to this user)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId, // ← filter by `user`
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a resume
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { html, css, name } = req.body;
    const update = {};
    if (html !== undefined) update.html = html;
    if (css !== undefined) update.css = css;
    if (name !== undefined) update.name = name;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      update,
      { new: true }
    );
    if (!resume)
      return res
        .status(404)
        .json({ error: "Resume not found or unauthorized" });
    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a resume
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!resume)
      return res
        .status(404)
        .json({ error: "Resume not found or unauthorized" });
    res.json({ message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
