// routes/auth.js
import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../model/users.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: login.toLowerCase() }, { email: login.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({
        id: "",
        username: "",
        token: "",
        error: "Invalid username or password",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        id: "",
        username: "",
        token: "",
        error: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        id: "",
        username: "",
        token: "",
        error: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      id: user._id,
      username: user.username,
      token,
      error: "",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      id: "",
      username: "",
      token: "",
      error: "Server error during login process.",
    });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset",
        text: `Reset your password by visiting: http://localhost:3000/api/auth/reset-password/${resetToken}`,
      });
    }
    res.json({
      message: "If that account exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// RESET PASSWORD (no complexity check here)
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Simply hash & save, without regex checks
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
