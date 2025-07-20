import express from "express";
import login from "./login.js";
import register from "./register.js";
import resumeRoutes from "./resumeRoutes.js";
import renderPDF from "./render-pdf.js";

const router = express.Router();

router.use("/login", login);
router.use("/register", register);
router.use("/resumes", resumeRoutes);
router.use("/", renderPDF);

export default router;
