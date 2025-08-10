import cookieParser from "cookie-parser";
import express from "express";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from "./routers/auth.routes.js";
import projectRoutes from "./routers/project.routes.js";
import taskRoutes from "./routers/task.routes.js";

// custom routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/p", projectRoutes);
app.use("/api/v1/t", taskRoutes);

//routes
app.get("/health-check", (req, res) => {
  res.send("working good");
});

export default app;
