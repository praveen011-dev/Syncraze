import {Router} from "express";
import isLoggedIn from "../middlewares/auth.middleware.js"
import { createSubtask, createTask, deleteSubtask, deleteTask, getTaskById, getTasks, updateSubtask, updateTask } from "../controllers/task.controllers.js";

import { taskValidator,subTaskValidator } from "../validators/task.validator.js";
import validate  from "../middlewares/validator.middleware.js";

const router=Router()

// TaskRoutes

router.route("/")
.get(isLoggedIn,getTasks)
.post(isLoggedIn,taskValidator(),validate,createTask)

router.route("/:task_id")
.get(isLoggedIn,getTaskById)
.put(isLoggedIn,taskValidator(),validate,updateTask)
.delete(isLoggedIn,deleteTask)



//Subtask Routes

router.route("/:task_id/subtask")
.post(isLoggedIn,subTaskValidator(),validate,createSubtask)

router.route("/:task_id/subtask/:subtask_id")
.put(isLoggedIn,subTaskValidator(),validate,updateSubtask)
.delete(isLoggedIn,deleteSubtask)

export default router