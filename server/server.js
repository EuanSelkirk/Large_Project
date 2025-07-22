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
const mountedRouters = [
  { prefix: "/auth", router: loginRouter },
  { prefix: "/auth", router: registerRouter },
  { prefix: "/resumes", router: resumeRouter },
  { prefix: "/debug", router: debugRouter },
];
mountedRouters.forEach(({ prefix, router }) => {
  apiRouter.use(prefix, router);
});

const API_BASE = "/api";

// Mount the API router
app.use(API_BASE, apiRouter);

// Root health-check endpoint
app.get("/", (req, res) => res.send("API running"));

// Debug: Print all active endpoints
const rootEndpoints = [{ path: "/", methods: "GET" }];
const apiEndpoints = mountedRouters.flatMap(({ prefix, router }) =>
  listEndpoints(router).map((e) => ({
    path: API_BASE + prefix + (e.path === "/" ? "" : e.path),
    methods: e.methods.join(", "),
  }))
);
console.table([...rootEndpoints, ...apiEndpoints], ["path", "methods"]);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
