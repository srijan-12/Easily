const express = require("express");
const { auth } = require("../middlewares/auth");
const recruiterCheck = require("../middlewares/recruiterCheck");
const JobModel = require("../model/jobModel");
const validateJobRegistration = require("../middlewares/validateJobRegistration.js")
const seekerCheck = require("../middlewares/seekerCheck.js");
const ownerCheck = require("../middlewares/ownerCheck.js");

const jobRouter = express.Router();

jobRouter.get("/job/getPostForm", auth,recruiterCheck,(req,res)=>{
    res.render("layouts", {body : "jobsRegister", errors: null})
})





//submit job post form
jobRouter.post("/job/postJoBRegistrationForm",auth,recruiterCheck,validateJobRegistration, async(req,res)=>{
    try{
        const {recruiterId} = req.cookies;
        const{title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired,lastDateApply,postCreatedBy} = req.body;
        const skillsArray = skillsRequired.split(',').map((skill)=> skill.trim());
        // console.log(skillsArray);
        const jobX = {title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired:skillsArray,lastDateApply,postCreatedBy: recruiterId}
        const newJob = new JobModel(jobX);
        await newJob.save();
        res.send("done + render all job cards here");
    }catch(err){
        res.render("layouts", {body: "jobsRegister", errors: err.message});

    }
})









//get specific job
jobRouter.get("/jobs/:id",auth,seekerCheck, async(req,res)=>{
    try{
        const {id} = req.params;
        const foundPost = await JobModel.findById(id);
        console.log(foundPost);
        if(foundPost){
            res.send(foundPost);
        }else{
            throw new Error("Post not found");
        }
    }catch(err){
        res.send(err.message);
    }
})

//applying for job
jobRouter.post("/jobs/apply/:id",auth,seekerCheck, async(req,res)=>{
    try{
        const {id} = req.params;
        const foundPost = await JobModel.findById(id);
        if(foundPost){
            const {seekerID} = req.cookies;
            if(!seekerID){
                throw new Error("Please login again");
            }else{
                console.log(seekerID);
                foundPost.applicants.push(seekerID);
                await foundPost.save();
                res.send(foundPost);
            }
            
        }else{
            throw new Error("Post not found");
        }
    }catch(err){
        res.send(err.message);
    }
})



//edit poster by owner only
jobRouter.patch("/jobs/edit/recruiter/:id",auth, recruiterCheck, ownerCheck,async(req,res)=>{
    try{
        const {id} = req.params;
        const {title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired,lastDateApply} = req.body;
        const newPoster = {title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired,lastDateApply};
        await JobModel.findByIdAndUpdate(id, newPoster);
        res.send("updated");
    }catch(err){
        res.status(401).send(err.message);
    }
})




//delete poster by owner only
jobRouter.delete("/jobs/delete/recruiter/:id",auth, recruiterCheck, ownerCheck,async(req,res)=>{
    try{
        const {id} = req.params;
        await JobModel.findByIdAndDelete(id);
        res.send("deleted");
    }catch(err){
        res.status(401).send(err.message);
    }
})





//get all jobs only for seeker
jobRouter.get("/jobs/alljobs/seeker", auth, seekerCheck, async(req,res)=>{
    try{
        const allJobsPosters = await JobModel.find({});
        res.send(allJobsPosters);
    }catch(err){
        res.status(401).send(err.message);
    }
})

//owner can see their all posts
jobRouter.get("/jobs/alljobs/recruiter", auth, recruiterCheck, async(req,res)=>{
    try{
        const {recruiterId} = req.cookies;
        const alljobs = await JobModel.find({postCreatedBy : recruiterId});
        res.send(alljobs);
    }catch(err){
        res.status(401).send(err.message);
    }
})

module.exports = jobRouter;