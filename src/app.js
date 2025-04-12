import express from "express";
import cookieParser from "cookie-parser";
const app= express();



//router imports 

import healthCheckRouter from "./routes/healthcheck.routes.js"
import authroutes from "./routes/auth.routes.js"
import projectroutes from "./routes/project.routes.js"

app.use(cookieParser());
app.use(express.json()); // <== This must be above any route handlers

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/users", authroutes);
app.use("/api/v1/projects", projectroutes);


export default app;