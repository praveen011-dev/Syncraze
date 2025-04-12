import {Router} from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router=Router()

router.post("/createProject",isLoggedIn,createProject)
router.post("/updateProject/:project_id",isLoggedIn,updateProject)
router.delete("/deleteProject/:project_id",isLoggedIn,deleteProject)
router.get("/getProjects",isLoggedIn,getProjects)



export default router