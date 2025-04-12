import {Router} from "express";
import { createProject, getProjects } from "../controllers/project.controllers";
import isLoggedIn from "../middlewares/auth.middleware";

const router=Router()

router.get("/createproject",isLoggedIn,createProject)



export default router