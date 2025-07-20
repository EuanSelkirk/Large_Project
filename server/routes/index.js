import express from "express";
import login from "./login.js";
import register from "./register.js";
import resumeRoutes from "./resumeRoutes.js";

const router = express.Router();

router.use("/auth", login);
router.use("/auth", register);
router.use("/resumes", resumeRoutes);

export default router;
