import express from "express";
import User from "../model/users.js";

const router = express.Router();

/**
 * GET /users
 * Debug endpoint: fetches all users from the database
 * and logs them to the server console.
 */
router.get("/users", async (req, res) => {
  console.log("here");
  try {
    const users = await User.find();
    console.log("🛠️ [DEBUG] All users:", users);
    res.status(200).json({
      message: "All users have been logged to the server console.",
      count: users.length,
    });
  } catch (err) {
    console.error("🛠️ [DEBUG] Error fetching users:", err);
    res.status(500).json({ error: "Server error fetching users." });
  }
});

export default router;
