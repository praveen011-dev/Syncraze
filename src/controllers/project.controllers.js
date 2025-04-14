import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import {asyncHandler} from '../utils/async-handler.js'
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";


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

    const {project_id}=req.params

    const project=await Project.findOne({_id:project_id,createdBy:req.user._id})

    if(!project){
        return res
        .status(400)
        .json(new ApiResponse(400, "Either you are not eligible to get Project or Project not found!"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,project,"Project Found Successfully"))

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

    if(project){
        await ProjectMember.create({
            user:req.user._id,
            project:project._id,
            role:UserRolesEnum.ADMIN
        })
    }
    
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
        .json(new ApiResponse(400,"Project id Missing"))
    }


    const project=await Project.findOneAndDelete({_id:project_id,createdBy:req.user._id})

    await ProjectMember.findOneAndDelete({project:project_id,user:req.user._id})

    console.log(project);

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
  
const getProjectMembers= async (req, res) => {
    // get project members

  };
  
const addMemberToProject = asyncHandler(async (req, res) => {
    // add member to project
    
    const {project_id}=req.params
    const {useremail,role}=req.body

    const inputUser=await User.findOne({email:useremail})

    if(!inputUser){
        return res
        .status(400)
        .json(new ApiResponse(400,"User not found"))
    }

    const checkUserRole= await ProjectMember.findOne({role:"admin",project:project_id})

    if(checkUserRole){

       const existMember=await ProjectMember.findOne({user:inputUser._id})
    
       if(existMember){
            return res
            .status(200)
            .json(new ApiResponse(200,"Member Already Exist"));
       }
       
        await ProjectMember.create({
            user:inputUser._id,
            project:project_id,
            role:role
        })
    }
   
     return res
    .status(200)
    .json(new ApiResponse(200,"Project Member Added Successfully"));
    
})
  
const deleteMember = async (req, res) => {
    // delete member from project
    const {project_id,member_id}=req.params

    const checkUserRole= await ProjectMember.findOne({role:"admin"})

    if(checkUserRole){
        const ismemberExist= await ProjectMember.findOneAndDelete({
            _id:member_id,
            project:project_id,
            $or:[{"role":"project_admin"},  {"role":"member"}]
        })

        if(!ismemberExist){
            return res
            .status(400)
            .json(new ApiResponse(400,"Member not found !"))
        }
        
        return res
        .status(200)
        .json(new ApiResponse(200,"Member Delete Sucessfully"));

    }

   

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
  