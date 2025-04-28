import express from "express";
import cookieParser from "cookie-parser";
const app= express();



//router imports 

import healthCheckRouter from "./routes/healthcheck.routes.js"
import authroutes from "./routes/auth.routes.js"
import projectroutes from "./routes/project.routes.js"
import noteroutes from "./routes/note.routes.js"
import taskroutes from "./routes/task.routes.js"


app.use(cookieParser());
app.use(express.json()); // <== This must be above any route handlers

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/users", authroutes);
app.use("/api/v1/projects", projectroutes);
app.use("/api/v1/projects/:projectId/notes", noteroutes);
app.use("/api/v1/projects/:projectId/tasks", taskroutes);


//global error handler
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});



export default app;