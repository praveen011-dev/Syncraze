import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import User from "../models/user.models.js";
import {Task} from "../models/task.models.js"
import {ProjectNote} from "../models/note.models.js"
import { SubTask } from "../models/subtask.models.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import {asyncHandler} from '../utils/async-handler.js'
import { UserRolesEnum } from "../utils/constants.js";


const getProjects = asyncHandler(async (req, res) => {

    const projectmember=await ProjectMember.findOne({user:req.user._id});
    
    const allprojects= await Project.findOne({_id:projectmember.project})
    console.log(allprojects)

    if(!allprojects){
        return res
        .status(400)
        .json(new ApiResponse(400, "No Projects Found in this Account"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,allprojects,"Your Projects",))
})
  
const getProjectById = asyncHandler(async (req, res) => {

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

})
  
const createProject = asyncHandler(async (req, res) => {
    // create project
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

    const project=await Project.findOneAndUpdate({_id:project_id,createdBy:req.user._id},{
        name:Newname,
        description:Newdescription
    })

    if(!project){

        return res
        .status(400)
        .json(new ApiResponse(400,"Either you are not eligible to update Project or Project not found!"));

    }

    return res
    .status(200)
    .json(new ApiResponse(200,"Project Update Sucessfully"));

  })
  
const deleteProject = asyncHandler(async (req, res) => {

    const {project_id}=req.params

    if(!project_id){
        return res
        .status(400)
        .json(new ApiResponse(400,"Project id Missing"))
    }


    const project=await Project.findOneAndDelete({_id:project_id,createdBy:req.user._id})


    const tasks = await Task.find({ project: project_id }, '_id'); 

    const allTaskIds=tasks.map(task=>task._id);
    


    await ProjectMember.deleteMany({project:project_id})
    await Task.deleteMany({project:project_id})
    await ProjectNote.deleteMany({project:project_id})
    await SubTask.deleteMany({task:{$in:allTaskIds}})
   

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
  
const getProjectMembers= asyncHandler(async (req, res) => {

    const {project_id}=req.params

    const allprojectMembers= await ProjectMember.find({project:project_id,user:req.user._id})

    if(!allprojectMembers || allprojectMembers.length === 0){
        return res
        .status(400)
        .json(new ApiResponse(400, "Either you are not eligible to get all project members or No ProjectMembers Found in this Project"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,allprojectMembers,"All Members",))
  })
  
const addMemberToProject = asyncHandler(async (req, res) => {
    // add member to project

    
    const {project_id}=req.params
    const {useremail,role}=req.body

    const inputUser=await User.findOne({email:useremail})

    if(!inputUser){
        return res
        .status(400)
        .json(new ApiResponse(400,"User not found please Signup! "))
    }

    const checkUserRole= await ProjectMember.findOne({role:"admin",project:project_id,user:req.user._id})

    if(checkUserRole){

       const existMember=await ProjectMember.findOne({user:inputUser._id,role:role})
    
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

        return res
        .status(200)
        .json(new ApiResponse(200,"Project Member Added Successfully"));
    }

    return res
    .status(400)
    .json(new ApiResponse(400,"Either you are not eligible to add member to this project or Project not found!"));
   
    
    
})
  
const deleteMember = asyncHandler(async (req, res) => {
    // delete member from project
    const {project_id,member_id}=req.params

    const checkUserRole= await ProjectMember.findOne({role:"admin",user:req.user._id})


    if(checkUserRole){
        const ismemberExist= await ProjectMember.findOneAndDelete({
            _id:member_id,
            project:project_id,
            $or:[{"role":"project_admin"},  {"role":"member"}]
        })

        if(!ismemberExist){
            return res
            .status(400)
            .json(new ApiResponse(400,"Either Member not found or Admin can't Delete yourSelf !"))
        }

        return res
        .status(200)
        .json(new ApiResponse(200,"Member Delete Sucessfully"));

    }

    return res
    .status(400)
    .json(new ApiResponse(400,"Either You Are not eligible to delete the member or member not Found"));

  })
  
const updateMemberRole = asyncHandler(async (req, res) => {
    const {project_id,member_id}=req.params

    const {role}=req.body

    const checkUserRole= await ProjectMember.findOne({role:"admin",user:req.user._id})

    if(checkUserRole){
        const ismemberExist= await ProjectMember.findOneAndUpdate({
            _id:member_id,
            project:project_id,
            $or:[{"role":"project_admin"},  {"role":"member"}]
        },{role:role})

        if(!ismemberExist){
            return res
            .status(400)
            .json(new ApiResponse(400,"Member not found!"))
        }

        return res
        .status(200)
        .json(new ApiResponse(200,"Member Update Sucessfully"));

    }

    return res
    .status(400)
    .json(new ApiResponse(400,"Either You Are not eligible to Update member role or member not Found"));


  })
  
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
  