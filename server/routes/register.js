// routes/register.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../model/users.js";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

const router = express.Router();

router.post("/register", async (req, res) => {
  // 1) Log the raw body so you can inspect what the client sent
  console.log("[REGISTER] req.body:", req.body);

  // 2) Marker to show this handler ran
  console.log("here");

  const { username, password, email } = req.body;

  // 3) Quick sanity check
  if (!username || !password || !email) {
    console.log("[REGISTER] Missing one of username/email/password");
    return res
      .status(400)
      .json({ error: "username, email, and password are all required." });
  }

  try {
    const login = username.toLowerCase();

    // 4) Check for existing user
    let user = await User.findOne({ username: login });
    if (user) {
      console.log("[REGISTER] Username already exists");
      return res
        .status(409)
        .json({ error: "User with this username already exists." });
    }

    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      console.log("[REGISTER] Email already exists");
      return res
        .status(409)
        .json({ error: "User with this email already exists." });
    }

    // 5) Enforce password rules
    if (!passwordRegex.test(password)) {
      console.log("[REGISTER] Password did not meet complexity requirements");
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
      });
    }

    // 6) Hash & save
    const hashedPass = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    user = new User({
      username: login,
      password: hashedPass,
      email: email.toLowerCase(),
      verificationToken,
    });
    await user.save();

    // 7) Send verification email
    const backend = process.env.BACKEND_URL || "http://localhost:5174";
    const verifyLink = `${backend}/api/auth/verify/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      to: user.email,
      subject: "Verify your email",
      text: `Click to verify your email: ${verifyLink}`,
    });

    // 8) Issue JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 9) Respond
    return res.status(201).json({
      id: user._id,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("[REGISTER] Server error:", err);
    return res.status(500).json({ error: "Server error during registration." });
  }
});

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("[VERIFY] Server error:", err);
    return res.status(500).json({ error: "Server error verifying email" });
  }
});

export default router;
