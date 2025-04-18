import { ProjectNote } from '../models/note.models.js'
import { ApiResponse } from '../utils/api.response.js'
import {asyncHandler} from '../utils/async-handler.js'


const createNote=asyncHandler(async(req,res)=>{

        const {project_id}=req.params
        const {content}=req.body
        if(!project_id){
            return res
            .status(400)
            .json(new ApiResponse(400,"Project not found!"))
        }

        if(!content){
            return res
            .status(400)
            .json(new ApiResponse(400,"Please Provide Note Content"))
        }

        const note=await ProjectNote.create({
            project:project_id,
            createdBy:req.user._id,
            content:content
        })  

        return res
        .status(200)
        .json(new ApiResponse(200,note,"Notes created Successfully"))

})


const updateNote=asyncHandler(async(req,res)=>{

        const {project_id}=req.params
        const {newContent}=req.body

        if(!project_id){
            return res
            .status(400)
            .json(new ApiResponse(400,"Project not found!"))
        }

        if(!newContent){
            return res
            .status(400)
            .json(new ApiResponse(400,"Please Provide content to update"))
        }

        const existingNote=await ProjectNote.findOne({project:project_id,createdBy:req.user._id}) 

        if(!existingNote){
            return res
            .status(400)
            .json(new ApiResponse(400,"Note not found!"))
        }

        const updatedNote=await ProjectNote.findByIdAndUpdate({_id:existingNote._id},{content:newContent},{new :true})

            return res
            .status(200)
            .json(new ApiResponse(200,updatedNote,"Notes Update Successfully"))

})


const deleteNote=asyncHandler(async(req,res)=>{
    const {project_id}=req.params
    if(!project_id){
        return res
        .status(400)
        .json(new ApiResponse(400,"Project not found!"))
    }

    const existingNote=await ProjectNote.findOne({project:project_id,createdBy:req.user._id}) 

    if(!existingNote){
        return res
        .status(400)
        .json(new ApiResponse(400,"Note not found!"))
    }

    await ProjectNote.findByIdAndDelete({_id:existingNote._id})

    return res
    .status(200)
    .json(new ApiResponse(200,"Note Delete Successfully"));
    
})

const getallnotes=asyncHandler(async(req,res)=>{
    const {project_id}=req.params
    if(!project_id){
        return res
        .status(400)
        .json(new ApiResponse(400,"Project not found!"))
    }

    const allnotes= await ProjectNote.find({project:project_id,createdBy:req.user._id})

    if(!allnotes){
        return res
        .status(400)
        .json(new ApiResponse(400,"No notes found in this project"))
    }


    return res
    .status(200)
    .json(new ApiResponse(200,allnotes,"Notes Found Successfully"))


    
})



const getnoteById=asyncHandler(async(req,res)=>{
    const {project_id,note_id}=req.params
    if(!project_id){
        return res
        .status(400)
        .json(new ApiResponse(400,"Project not found!"))
    }

    if(!note_id){
        return res
        .status(400)
        .json(new ApiResponse(400,"Invalid note id"))
    }


    const singlenote= await ProjectNote.find({_id:note_id,createdBy:req.user._id})

    if(!singlenote){
        return res
        .status(400)
        .json(new ApiResponse(400,"No note found in this project"))
    }


    return res
    .status(200)
    .json(new ApiResponse(200,singlenote,"Note Found Successfully"))


    
})


export {createNote,updateNote,deleteNote,getallnotes,getnoteById}