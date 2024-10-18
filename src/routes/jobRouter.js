const express = require("express");
const { auth } = require("../middlewares/auth");
const { authR } = require("../middlewares/authR");
const recruiterCheck = require("../middlewares/recruiterCheck");
const JobModel = require("../model/jobModel");
const UserModel = require("../model/userModel.js");
const validateJobRegistration = require("../middlewares/validateJobRegistration.js")
const seekerCheck = require("../middlewares/seekerCheck.js");
const ownerCheck = require("../middlewares/ownerCheck.js");

const jobRouter = express.Router();



jobRouter.get("/home",(req,res)=>{
    res.render("layouts",{body: "homepage"});
})

jobRouter.get("/job/getPostForm", authR,recruiterCheck,(req,res)=>{
    res.render("layouts", {body : "jobsRegister", errors: null, User: "recruiter"});
})





//submit job post form  -> done
jobRouter.post("/job/postJoBRegistrationForm",authR,recruiterCheck,validateJobRegistration, async(req,res)=>{
    try{
        const {recruiterId} = req.cookies;
        const{title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired,lastDateApply,postCreatedBy} = req.body;
        const skillsArray = skillsRequired.split(',').map((skill)=> skill.trim());
        // console.log(skillsArray);
        const jobX = {title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired:skillsArray,lastDateApply,postCreatedBy: recruiterId}
        const newJob = new JobModel(jobX);
        await newJob.save();
        const allJobsPosters = await JobModel.find({});
        if(allJobsPosters.length >0){
            res.render("layouts",{body : "jobPage", jobs : allJobsPosters, errors : null, recruiter:true, seeker:null});
        }else{
            throw new Error("No job poster to show");
        }
    }catch(err){
        res.render("layouts", {body: "jobsRegister", errors: err.message});

    }
})









//get specific job -> done        
jobRouter.get("/jobs/:id",auth,seekerCheck, async(req,res)=>{
    try{
        const {id} = req.params;
        const foundPost = await JobModel.findById(id);
        console.log(foundPost);
        if(foundPost){
            // res.send(foundPost);
            res.render("layouts",{body: "specificJobPage", foundPost, recruiter:null, seeker:true, errors:null})
        }else{
            throw new Error("Post not found");
        }
    }catch(err){
        res.render("layouts",{body: "jobPage", errors : err.message})
    }
})






//get specific job -> done        
jobRouter.get("/jobs/recruiter/:id",authR,recruiterCheck,ownerCheck, async(req,res)=>{
    try{
        const {id} = req.params;
        const foundPost = await JobModel.findById(id);
        console.log(foundPost);
        if(foundPost){
            // res.send(foundPost);
            res.render("layouts",{body: "specificJobPage", foundPost, recruiter:true, seeker:null, errors:null});
        }else{
            throw new Error("Post not found");
        }
    }catch(err){
        res.render("layouts",{body: "jobPage", errors : err.message})
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
                console.log("inside else");
                foundPost.applicants.push(seekerID);
                console.log(foundPost);
                await foundPost.populate('applicants', ['firstName', 'email', 'phoneNumber', 'resumeLink']);
                await foundPost.save();
                res.render("layouts",{body: "specificJobPage", foundPost, recruiter:null, seeker:true, errors:null});
            }
            
        }else{
            throw new Error("Post not found");
        }
    }catch(err){
        res.render("layouts",{body: "specificJobPage", foundPost:null, recruiter:null, seeker:true, errors:err.message});
    }
})

jobRouter.get("/jobs/getEditForm/recruiter/:id", authR, recruiterCheck, ownerCheck, async(req,res)=>{
    try{
        const {id} = req.params;
       const oldJobData = await JobModel.findById(id);
       res.render("layouts", {body : "jobGetUpdateForm", oldJobData, errors:null});

    }catch(err){
        res.render("layouts", {body : "jobGetUpdateForm", oldJobData : null, errors:err.message});
    }
})


//edit poster by owner only
jobRouter.patch("/jobs/edit/recruiter/:id",authR, recruiterCheck, ownerCheck,async(req,res)=>{
    try{
        const {id} = req.params;
        const {title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired,lastDateApply} = req.body;
        const skillsArr = skillsRequired.split(",").map((skill)=>{
            return skill.trim();
        })
        const newPoster = {title,description,category,designation,location,company,salary,exprienceReq,opeanings,skillsRequired:skillsArr,lastDateApply};
        await JobModel.findByIdAndUpdate(id, newPoster);
        const foundPost = await JobModel.findById(id);
        res.render("layouts",{body: "specificJobPage", foundPost, recruiter:true, seeker:null, errors:null});
    }catch(err){
        res.render("layouts",{body: "specificJobPage", foundPost, recruiter:true, seeker:null, errors:err.message});
    }
})




//delete poster by owner only
jobRouter.delete("/jobs/delete/recruiter/:id",authR, recruiterCheck, ownerCheck,async(req,res)=>{
    try{
        const {id} = req.params;
        await JobModel.findByIdAndDelete(id);
        const allJobsPosters = await JobModel.find({});
        if(allJobsPosters.length >0){
            res.render("layouts",{body : "jobPage", jobs : allJobsPosters, errors : null, recruiter:true, seeker:null});
        }else{
            throw new Error("No job poster to show");
        }
        
    }catch(err){
        res.render("layouts",{body: "jobPage", errors : err.message})
    }
})





//get all jobs only for seeker ->done  
jobRouter.get("/jobs/alljobs/seeker",auth, seekerCheck, async(req,res)=>{
    try{
        console.log("clicked");
        const allJobsPosters = await JobModel.find({});
        // res.send(allJobsPosters);
        res.render("layouts",{body : "jobPage", jobs : allJobsPosters, errors : null, recruiter:null, seeker:true});
    }catch(err){
        res.render("layouts", {body : "seekerLoginForm", errors : err.message, seeker: null,recruiter: null});
    }
})

//owner can see their all posts ->done
jobRouter.get("/jobs/alljobs/recruiter", authR, recruiterCheck, async(req,res)=>{
    try{
        const {recruiterId} = req.cookies;
        const alljobs = await JobModel.find({postCreatedBy : recruiterId});
        if(alljobs.length >0){
            res.render("layouts",{body : "jobPage", jobs : alljobs, errors : null, recruiter:true, seeker:null, User: "recruiter"});
        }else{
            throw new Error("No job poster to show");
        }
    }catch(err){
        // res.send(err.message);
        res.render("layouts",{body : "jobPage", jobs : null, errors : err.message,recruiter:true, seeker:null});
    }
})

module.exports = jobRouter;








//  