import {Router} from "express";
import isLoggedIn from "../middlewares/auth.middleware.js"
import { createNote, deleteNote, getallnotes, getnoteById, updateNote } from "../controllers/note.controllers.js";


import { noteValidator } from "../validators/note.validator.js";
import  validate  from "../middlewares/validator.middleware.js";
const router=Router()

router.route("/")
.get(isLoggedIn,getallnotes)
.post(isLoggedIn,noteValidator(),validate,createNote)


router.route("/:note_id")
.put(isLoggedIn,noteValidator(),validate,updateNote)
.delete(isLoggedIn,deleteNote)
.get(isLoggedIn,getnoteById)


export default router