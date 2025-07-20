import express from "express";
import Resume from "../model/Resume.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const resume = new Resume({
            ...req.body,
            userId: req.user.userId
        });
        await resume.save();
        res.status(201).json(resume);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", authenticate, async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user.userId });
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", authenticate, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ error: "Resume not found" });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", authenticate, async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!resume) return res.status(404).json({ error: "Resume not found or unauthorized" });
        res.json(resume);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ error: "Resume not found or unauthorized" });
        res.json({ message: "Resume deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
