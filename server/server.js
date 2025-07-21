import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import resumeRouter from "./routes/resumeRoutes.js";
import debugRouter from "./routes/debug.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Main API router (previously index.js)
const apiRouter = express.Router();
apiRouter.use("/auth", loginRouter);
apiRouter.use("/auth", registerRouter);
apiRouter.use("/resumes", resumeRouter);
apiRouter.use("/debug", debugRouter);

// Mount the API router
app.use("/api", apiRouter);

// Root health-check endpoint
app.get("/", (req, res) => res.send("API running"));

// Debug: Print all active endpoints
const rootEndpoints = listEndpoints(app).map((e) => ({
  path: e.path,
  methods: e.methods.join(", "),
}));
const apiEndpoints = listEndpoints(apiRouter).map((e) => ({
  path: "/api" + e.path,
  methods: e.methods.join(", "),
}));
console.table([...rootEndpoints, ...apiEndpoints], ["path", "methods"]);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
