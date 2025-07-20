import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: String,
  code: String,
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
