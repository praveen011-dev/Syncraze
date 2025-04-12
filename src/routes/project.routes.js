import {Router} from "express";
import { addMemberToProject, createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/project.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router=Router()

router.post("/createProject",isLoggedIn,createProject)
router.post("/updateProject/:project_id",isLoggedIn,updateProject)
router.delete("/deleteProject/:project_id",isLoggedIn,deleteProject)

router.route("/getProject/:project_id")
.get(isLoggedIn,getProjectById)
.post(isLoggedIn,addMemberToProject)

router.get("/getProjects",isLoggedIn,getProjects)

//Project Members Routes

// router.post("/addMemberToProject/project-",isLoggedIn,addMemberToProject)



export default router