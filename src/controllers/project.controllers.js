import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";


const getProjects = async (req, res) => {
    // get all projects


  };
  
  const getProjectById = async (req, res) => {
    // get project by id
  };
  
  const createProject = async (req, res) => {
    // create project
    const user=req.user

    if(!user){
        return res
        .status(400)
        .json(new ApiError(400,"User not Found"))
    }

    const {name,description}=req.body

    if(!name){
        return res
        .status(400)
        .json(new ApiError(400, { message: "Please enter Project name" }));
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
    
  };
  
  const updateProject = async (req, res) => {
    // update project


  };
  
  const deleteProject = async (req, res) => {
    // delete project
  };
  
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
  