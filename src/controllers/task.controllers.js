import {asyncHandler} from "../utils/async-handler.js"
import {ApiResponse} from "../utils/api.response.js"
import {ApiError} from "../utils/api.error.js"
import {Task} from "../models/task.models.js"
import  User from "../models/user.models.js"
import { ProjectMember } from "../models/projectmember.models.js"
import { SubTask } from "../models/subtask.models.js"




const createTask=asyncHandler(async(req,res,next)=>{
    const {project_id}=req.params
    if(!project_id){
        return next(new ApiError(400,"Invalid project id"))
    }
    const {
        title,
        description,
        assignedTo,
        status,
        attachments
        }=req.body


    const AssignedUser=await User.findOne({email:assignedTo})

    if(!AssignedUser){
        return next(new ApiError(400,"Assigned User not found"))
    }
    
    const IsProjectMember=await ProjectMember.find({user:AssignedUser._id})


    if(!IsProjectMember){
        return next(new ApiError(400,"Project not Assigned to this user"))
    }

    const task= await Task.create({
        title,
        description,
        project:project_id,
        assignedTo:AssignedUser._id,
        assignedBy:req.user._id,
        status,
        attachments
    })

    if(!task){
        return next(new ApiError(400,"Please enter valid details"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task Created Successfully"))
})

const updateTask=asyncHandler(async(req,res,next)=>{
    const {project_id,task_id}=req.params
    if(!project_id || !task_id){
        return next(new ApiError(400,"Invalid project OR task id"))
    }
    const {
        title:newTitle,
        description:newDescription,
        assignedTo:newAssignedTo,
        status:newStatus,
        attachments:newAttachments
        }=req.body


    const AssignedUser=await User.findOne({email:newAssignedTo})

    if(!AssignedUser){
        return next(new ApiError(400,"Assigned User not found"))
    }

    
    const IsProjectMember=await ProjectMember.find({user:AssignedUser._id})


    if(!IsProjectMember){
        return next(new ApiError(400,"Project not Assigned to this user"))
    }

    const task= await Task.findById({_id:task_id})

    if(!task){
        return next(new ApiError(400,"Task not found"))
    }

    const updatedTask= await Task.findByIdAndUpdate({_id:task_id},{
        title:newTitle ?? task.title,
        description:newDescription ??task.description,
        project:project_id,
        assignedTo:AssignedUser._id ??task.assignedTo,
        assignedBy:req.user._id,
        status:newStatus??task.status,
        attachments:newAttachments??task.attachments
    },{new:true})

    if(!updatedTask){
        return next(new ApiError(400,"Please enter valid details"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedTask,"Task Updated Successfully"))
})

const deleteTask=asyncHandler(async(req,res,next)=>{
    const {project_id,task_id}=req.params
    if(!project_id || !task_id){
        return next(new ApiError(400,"Invalid project id OR task id"))
    }


    const IsProjectMember=await ProjectMember.find({user:req.user._id})


    if(!IsProjectMember){
        return next(new ApiError(400,"Project not Assigned to this user"))
    }

    const deletedTask= await Task.findByIdAndDelete({_id:task_id})


    if(!deletedTask){
        return next(new ApiError(400,deleteTask,"Task not found or Deleted"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,deletedTask,"Task Deleted Successfully"))


})

const getTasks=asyncHandler(async(req,res,next)=>{
    const {project_id}=req.params
    if(!project_id){
        return next(new ApiError(400,"Invalid project id "))
    }

    const allTasks= await Task.findOne({project:project_id,
        $or:[{assignedTo:req.user._id},{assignedBy:req.user._id}]})


    if(!allTasks || allTasks.length==0){
        return next(new ApiError(400,"no Tasks Found in this account"))
    }

        return res
        .status(200)
        .json(new ApiResponse(200,allTasks,"Tasks Found Successfully"));


})

const getTaskById=asyncHandler(async(req,res,next)=>{
    const {project_id,task_id}=req.params
    if(!project_id || !task_id){
        return next(new ApiError(400,"Invalid project OR task id"))
    }

    const getTask=await Task.findOne({_id:task_id,project:project_id,
        $or:[{assignedTo:req.user._id},{assignedBy:req.user._id}]
    })

    if(!getTask){
        return next(new ApiError(400,"No Task found!"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"Task Found Successfully",getTask))

})

//Subtask Controllers


const createSubtask=asyncHandler(async(req,res,next)=>{
    const {task_id}=req.params
    const {title}=req.body
    

    if(!task_id){
        return next(new ApiError(400,"task id Required"))
    }

    const getTask=await Task.findOne({_id:task_id,
        $or:[{assignedTo:req.user._id},{assignedBy:req.user._id}]
    })

    
    if(!getTask){
        return next(new ApiError(400,"No Task found!"))
    }

    const subtask=await SubTask.create({
        title,
        task:task_id,
        createdBy:req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200,subtask,"SubTask Created Successfully"))
})

const updateSubtask=asyncHandler(async(req,res,next)=>{
    const {subtask_id}=req.params
    const {title:newTitle}=req.body
    

    if(!subtask_id){
        return next(new ApiError(400,"subtask id Required"))
    }

   

    const subTask= await SubTask.findById({_id:subtask_id})

    if(!subTask){
        return next(new ApiError(400,"SubTask not found"))
    }

    const updatedSubtask=await SubTask.findByIdAndUpdate({_id:subtask_id},{
        
        title:newTitle?? subTask.title,
        task:subTask.task,
        createdBy:req.user._id

    },{new:true})

    return res
    .status(200)
    .json(new ApiResponse(200,"SubTask Update Successfully",updatedSubtask))
})


const deleteSubtask=asyncHandler(async(req,res,next)=>{
    const {subtask_id}=req.params
    
    if(!subtask_id){
        return next(new ApiError(400,"subtask id Required"))
    }


    const subTask= await SubTask.findById({_id:subtask_id})

    if(!subTask){
        return next(new ApiError(400,"SubTask not found"))
    }

    const deleteSubtask=await SubTask.findByIdAndDelete({_id:subtask_id,createdBy:req.user._id})

    if(!deleteSubtask){
    return next(new ApiError(400,"Task can't be delete"))
    }


    return res
    .status(200)
    .json(new ApiResponse(200,"SubTask Deleted Successfully"))
})


export{createTask,updateTask,deleteTask,getTasks,getTaskById,createSubtask,updateSubtask,deleteSubtask}