import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import {asyncHandler} from '../utils/async-handler.js'


const getProjects = asyncHandler(async (req, res) => {
    const allprojects= await Project.find({createdBy:req.user._id})

    if(!allprojects || allprojects.length === 0){
        return res
        .status(400)
        .json(new ApiResponse(400, "No Projects Found in this Account"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,allprojects,"Your Projects",))
})
  
const getProjectById = async (req, res) => {
    // get project by id
  };
  
  const createProject = asyncHandler(async (req, res) => {
    // create project
    const user=req.user

    const {name,description}=req.body

    if(!name){
        return res
        .status(400)
        .json(new ApiError(400, { message: "Please enter Project name" }));
    }

    const projectExist=await Project.findOne({name})

    if(projectExist){
         return res
         .status(400)
         .json(new ApiResponse(400, "Project name already exist choose different" ));
    }

    const project =await Project.create({
        name,
        description,
        createdBy:req.user._id
    })

    await project.save();
    
    return res
    .status(200)
    .json(new ApiResponse(200,`Project Created Successfully by: ${req.user.email}`))
    
  }
)
  
  const updateProject = asyncHandler(async (req, res) => {
    // update project
    const user=req.user

    const {project_id}=req.params
    const {name:Newname,description:Newdescription}=req.body

    const projectExist=await Project.findOne({name:Newname})

    if(projectExist){
         return res
         .status(400)
         .json(new ApiResponse(400,"Project name already exist choose different" ));
    }

    const project=await Project.findOne({_id:project_id,createdBy:req.user._id})

    if(project){

        project.name=Newname
        project.description=Newdescription
    
        await project.save();
    
        return res
        .status(200)
        .json(new ApiResponse(200,"Project Update Sucessfully"));
    }

    else{
        return res
        .status(400)
        .json(new ApiResponse(400,"Either you are not eligible to update Project or Project not found!"));
    }

  })
  
  const deleteProject = asyncHandler(async (req, res) => {
    const user=req.user

    const {project_id}=req.params

    if(!project_id){
        return res
        .status(400)
        .json(new ApiResponse(400,"Project not found"))
    }

    const project=await Project.findByIdAndDelete({_id:project_id,createdBy:req.user._id})

    if(!project){
        return res
        .status(400)
        .json(new ApiResponse(400,"Either you are not eligible to delete Project or Project not found!"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"Project Delete Successfully"))


  }
)
  
  const getProjectMembers = async (req, res) => {
    // get project members
  };
  
  const addMemberToProject = async (req, res) => {
    // add member to project
  };
  
  const deleteMember = async (req, res) => {
    // delete member from project
  };
  
  const updateMemberRole = async (req, res) => {
    // update member role
  };
  
  export {
    addMemberToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject,
  };
  