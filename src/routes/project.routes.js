import {Router} from "express";
import { createProject, getProjects } from "../controllers/project.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router=Router()

router.post("/createproject",isLoggedIn,createProject)



export default router