const express = require("express");
const recruiterRouter = express.Router();
const {validateUserRegistrationForRecruiter} = require("../middlewares/validateUserRegistration.js")
const UserModel = require("../model/userModel.js");
const {generateHashPassword} = require("../middlewares/hashPassword.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const {auth} = require("../middlewares/auth.js");
const JobModel = require("../model/jobModel.js");
const recruiterCheck = require("../middlewares/recruiterCheck.js");
const ownerCheck = require("../middlewares/ownerCheck.js");
const clearCookie = require("../middlewares/clearCookie.js");
const uploadFiles = require("../../cloudConfig.js");

recruiterRouter.get("/user/recruiter", (req,res)=>{
    // res.send("recruiter login form!!!");
    res.render("layouts");
})


recruiterRouter.post("/user/submitRegistrationForm/recruiter",uploadFiles.fields([
    {name : "profileUrl", maxCount : 1}]),validateUserRegistrationForRecruiter, async (req,res)=>{
    try{
        const{firstName,lastName,email,phoneNumber,password,gender,resumeLink,type,skills,expYears,company} = req.body;
        const profileUrl = req.files.profileUrl ? req.files.profileUrl[0].path : null;
        console.log(profileUrl);
        const hashedPassword = await generateHashPassword(password);
        console.log(hashedPassword);
        const userData = {firstName,
            lastName,
            email,
            phoneNumber,
            password : hashedPassword,
            gender,
            profileUrl,
            resumeLink : "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SX679_.jpg",
            type:"recruiter",
            skills : ["html", "css", "js", "node"],
            expYears : 1,
            company : "xRec"
        };
        const newUser = new UserModel(userData);
        await newUser.save();
        res.status(200).send("recruiter validation");
    }catch(err){
        console.log(err.message);
        res.status(401).send(err.message);
    }
})

recruiterRouter.get("/user/getLoginForm/recruiter",(req,res)=>{
    console.log("get hits")
    res.render("layouts", {body : "recruiterLoginForm", errors : null});
})

recruiterRouter.post("/user/login/recruiter", async (req,res)=>{
    try{
        const{email,password: userPassword} = req.body;
        // console.log(email,password);
        const foundUser = await UserModel.findOne({email});
        // console.log(foundUser.firstName);
    if(foundUser){   
        const isValidated = await bcrypt.compare(userPassword, foundUser.password);
        if(isValidated && foundUser.type === "recruiter"){
            const {recruiterId, seekerID} = req.cookies;
            // console.log(recruiterId, seekerID);
            
            if(recruiterId){
                res.clearCookie("recruiterId");
            }
            if(seekerID){
                res.clearCookie("seekerID");
            }
            req.session.userId = foundUser._id;
            res.cookie("recruiterId", foundUser._id);
            // return res.send("loggedin" + foundUser);        //see all your job posters or post new job here
        }else{
            console.log("error in password");
            throw new Error("Invalid Credentialsp");
        }
    }else{
        console.log("user not found");
        throw new Error("Invalid Credentials");
    }
    }catch(err){
        res.send(err.message);
    }
});

recruiterRouter.get("/user/logout/recruiter", (req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                throw new Error("Log out could not be completed at this moment");
            }else{
                res.cookie("recruiterId", null);
                res.clearCookie('connect.sid');
                res.clearCookie('recruiterId');
                res.status(200).send("logged out");
            }
        })
    }catch(err){
        res.status(401).send(err.message);
    }
})

//get all applicants of a specific post
recruiterRouter.get("/user/allapplicants/recruiter/:id", auth,recruiterCheck,ownerCheck,async (req,res)=>{
    // try{
    //     const{id} = req.params;
    //     // console.log("***************")
    //     // console.log(id);
    //     // console.log("***************")
    //     const foundPost = await JobModel.findById(id);
    //     console.log(foundPost);
    //     if(foundPost){
    //         const {recruiterId} = req.cookies;
    //         if(!recruiterId){
    //             throw new Error("Please login again");
    //         }else{
    //             console.log(foundPost.postCreatedBy ,"==", recruiterId)
    //             if(foundPost.postCreatedBy == recruiterId){
    //                 const allApplicant = foundPost.applicants;
    //                 if(allApplicant.length > 0){
    //                     res.send(allApplicant)
    //                 }else{
    //                     throw new Error("No applicants to show")
    //                 } 
    //             }else{
    //                 throw new Error("Only post owner can view applicants")
    //             }
    //         }
    //     }else{
    //         throw new Error("Invalid request Job post not found!!");
    //     }
    // }catch(err){
    //     res.status(401).send(err.message);
    // }


    try{
        const{id} = req.params;
        const foundPost = await JobModel.findById(id);
        const allApplicant = foundPost.applicants;
        if(allApplicant.length > 0){
            res.send(allApplicant)
        }else{
            throw new Error("No applicants to show")
        } 
    }catch(err){
        res.status(401).send(err.message);
    }
})






module.exports = recruiterRouter;