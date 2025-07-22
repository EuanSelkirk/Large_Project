// routes/auth.js
import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import User from "../model/users.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const msg = {
        to: user.email,
        from: {
          name: "ResumeBuilder",
          email: process.env.SENDER_EMAIL,
        },
        subject: "Your Password Reset Request",
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You are receiving this email because a password reset was requested for your account.</p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
              Reset Your Password
            </a>
            <p style="margin-top: 20px;">This link will expire in one hour.</p>
            <p style="font-size: 12px;">If you did not request a password reset, please disregard this email.</p>
          </div>
        `,
      };

      await sgMail.send(msg);
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
