import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  phone: String,
  summary: String,
  education: [
    {
      school: String,
      degree: String,
      year: String,
    },
  ],
  experience: [
    {
      company: String,
      title: String,
      years: String,
      description: String,
    },
  ],
  skills: [String],
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
