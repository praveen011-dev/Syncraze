import {Router} from "express";
import isLoggedIn from "../middlewares/auth.middleware.js"
import { createNote, deleteNote, getallnotes, getnoteById, updateNote } from "../controllers/note.controllers.js";

const router=Router()

router.route("/createnote/:project_id")
.post(isLoggedIn,createNote)

router.route("/updatenote/:project_id")
.post(isLoggedIn,updateNote)

router.route("/deletenote/:project_id")
.delete(isLoggedIn,deleteNote)

router.route("/getnotes/:project_id")
.get(isLoggedIn,getallnotes)


router.route("/getnoteById/:project_id/note/:note_id")
.get(isLoggedIn,getnoteById)


export default router