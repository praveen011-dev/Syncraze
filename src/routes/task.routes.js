import {Router} from "express";
import isLoggedIn from "../middlewares/auth.middleware.js"
import { createSubtask, createTask, deleteSubtask, deleteTask, getTaskById, getTasks, updateSubtask, updateTask } from "../controllers/task.controllers.js";

const router=Router()

// TaskRoutes

router.route("/createTask/:project_id")
.post(isLoggedIn,createTask)

router.route("/updateTask/:project_id/task/:task_id")
.post(isLoggedIn,updateTask)

router.route("/updateTask/:project_id/task/:task_id")
.post(isLoggedIn,updateTask)

router.route("/deleteTask/:project_id/task/:task_id")
.delete(isLoggedIn,deleteTask)

router.route("/getTasks/:project_id")
.get(isLoggedIn,getTasks)

router.route("/getTaskById/:project_id/task/:task_id")
.get(isLoggedIn,getTaskById)


//Subtask Routes

router.route("/createSubtask/:task_id")
.post(isLoggedIn,createSubtask)

router.route("/updateSubtask/:subtask_id")
.post(isLoggedIn,updateSubtask)

router.route("/deleteSubtask/:subtask_id")
.delete(isLoggedIn,deleteSubtask)

export default router