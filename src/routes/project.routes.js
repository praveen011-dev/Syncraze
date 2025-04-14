import {Router} from "express";
import { addMemberToProject, createProject, deleteMember, deleteProject, getProjectById, getProjectMembers, getProjects, updateMemberRole, updateProject } from "../controllers/project.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router=Router()

router.post("/createProject",isLoggedIn,createProject)
router.post("/updateProject/:project_id",isLoggedIn,updateProject)
router.delete("/deleteProject/:project_id",isLoggedIn,deleteProject)

router.route("/getProject/:project_id")
.get(isLoggedIn,getProjectById)
.post(isLoggedIn,addMemberToProject)

router.route("/getProjects")
.get(isLoggedIn,getProjects)

//Project Members Routes

router.route("/addMemberToProject/:project_id")
.post(isLoggedIn,addMemberToProject)


router.route("/deleteMember/:project_id/memberid/:member_id")
.delete(isLoggedIn,deleteMember)

router.route("/allprojectMembers/:project_id")
.get(isLoggedIn,getProjectMembers)

router.route("/updateMember/:project_id/memberid/:member_id")
.post(isLoggedIn,updateMemberRole)

export default router