import { ProjectNote } from '../models/note.models.js'
import { ApiResponse } from '../utils/api.response.js'
import {asyncHandler} from '../utils/async-handler.js'
import { ApiError } from "../utils/api.error.js";



const createNote=asyncHandler(async(req,res,next)=>{

        const {project_id}=req.params
        const {content}=req.body
        if(!project_id){
            return next(new ApiError(400,"Project not found!"))
        }

        const note=await ProjectNote.create({
            project:project_id,
            createdBy:req.user._id,
            content
        })  

        if(!note){
            return next(new ApiError(400,"Error while creating a note"))
        }

        return res
        .status(200)
        .json(new ApiResponse(200,note,"Notes created Successfully"))

})


const updateNote=asyncHandler(async(req,res,next)=>{

        const {project_id,note_id}=req.params
        const {content:newContent}=req.body

        if(!project_id){
            return next(new ApiError(400,"projectId is required!"))
        }

        if(!note_id){
            return next(new ApiError(400,"NoteId required!"))
        }


        const updatedNote=await ProjectNote.findByIdAndUpdate({_id:note_id,project:project_id,createdBy:req.user._id},{content:newContent},{new :true})

            return res
            .status(200)
            .json(new ApiResponse(200,updatedNote,"Notes Update Successfully"))

})


const deleteNote=asyncHandler(async(req,res,next)=>{
    const {project_id,note_id}=req.params
    if(!project_id){
        return next(new ApiError(400,"projectId is required!"))
    }

    if(!note_id){
        return next(new ApiError(400,"NoteId required!"))
    }


    const note=await ProjectNote.findByIdAndDelete({_id:note_id,project:project_id,createdBy:req.user._id})

    if(!note){
        return next(new ApiError(400,"Error While deleting the note"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"Note Delete Successfully"));
    
})

const getallnotes=asyncHandler(async(req,res,next)=>{
    const {project_id}=req.params
    if(!project_id){
        return next(new ApiError(400,"Project not found!"))
    }

    const allnotes= await ProjectNote.find({project:project_id,createdBy:req.user._id})

    if(!allnotes){
        return next(new ApiError(400,"No notes found in this project"))
    }


    return res
    .status(200)
    .json(new ApiResponse(200,allnotes,"Notes Found Successfully"))


    
})



const getnoteById=asyncHandler(async(req,res,next)=>{
    const {project_id,note_id}=req.params
    if(!project_id){
        return next(new ApiError(400,"Project not found!"))
    }

    if(!note_id){
        return next(new ApiError(400,"Invalid note id"))
    }

    const singlenote= await ProjectNote.find({_id:note_id,createdBy:req.user._id})

    if(!singlenote){
        return next(new ApiError(400,"No note found in this project"))
    }


    return res
    .status(200)
    .json(new ApiResponse(200,singlenote,"Note Found Successfully"))


    
})


export {createNote,updateNote,deleteNote,getallnotes,getnoteById}