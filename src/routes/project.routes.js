import {Router} from "express";
import { addMemberToProject, createProject, deleteMember, deleteProject, getProjectById, getProjectMembers, getProjects, updateMemberRole, updateProject } from "../controllers/project.controllers.js";

import isLoggedIn from "../middlewares/auth.middleware.js";

import { addMemberValidator,ProjectValidator } from "../validators/project.validator.js";

import { validate } from "../middlewares/validator.middleware.js";

const router=Router()

//Project Routes

router.route("/")
.post(isLoggedIn,ProjectValidator(),validate,createProject)
.get(isLoggedIn,getProjects)

router.route("/:project_id")

.get(isLoggedIn,getProjectById)
.put(isLoggedIn,updateProject)
.delete(isLoggedIn,deleteProject)



//Project Members Routes

router.route("/:project_id/members")
.post(isLoggedIn,addMemberValidator(),validate,addMemberToProject)
.get(isLoggedIn,getProjectMembers)

router.route("/:project_id/members/:member_id")
.delete(isLoggedIn,deleteMember)
.put(isLoggedIn,updateMemberRole)

export default router