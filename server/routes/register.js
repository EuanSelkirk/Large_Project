import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../model/users.js";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const router = express.Router();

router.post("/register", async (req, res) => {
  let error = "";
  const { username, password, email } = req.body;
  let id = -1;
  let token = "";

  console.log("here");

  try {
    const login = username.toLowerCase();

    let user = await User.findOne({ username: login });
    if (user) {
      error = "User with this login already exists.";
      return res.status(409).json({ id: -1, email: "", error: error });
    }

    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      error = "User with this email already exists.";
      return res.status(409).json({ id: -1, email: "", error: error });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(20).toString("hex");

    user = new User({
      username: login,
      password: hashedPass,
      email: email.toLowerCase(),
      verificationToken,
    });

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
      subject: "Verify your email",
      text: `Click to verify: http://localhost:3000/api/register/verify/${verificationToken}`,
    });

    id = user._id;

    token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error("Registration error:", err);
    error = "Server error during registration.";
    if (err.name === "ValidationError") {
      error = `Validation error: ${err.message}`;
    }
    return res.status(500).json({ id: -1, email: "", token: "", error: error });
  }

  res.status(201).json({
    id,
    email,
    token,
    error,
  });
});

router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
