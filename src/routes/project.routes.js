import {Router} from "express";
import { createProject, getProjects, updateProject } from "../controllers/project.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router=Router()

router.post("/createProject",isLoggedIn,createProject)
router.post("/updateProject/:project_id",isLoggedIn,updateProject)



export default router