import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { limiter } from "./config/rateLimiter.js";
import fs from "fs"
import path from "path";

const app = express();

const tempDir = path.join(process.cwd(), "public", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true }); // "recursive" makes nested dirs if needed
}

//middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(limiter);


// custom routes
import authRoutes from "./routers/auth.routes.js";
import projectRoutes from "./routers/project.routes.js";
import taskRoutes from "./routers/task.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/t", taskRoutes);


export default app;
