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
    // res.send("recruiter register form!!!");
    res.render("layouts",{body : "recruiterRegister",  errors: null});
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
        res.render("layouts", {body : "recruiterLoginForm", errors : null});
    }catch(err){
        console.log(err.message);
        res.render("layouts", {body : "recruiterRegister", errors : err.message});
    }
})

recruiterRouter.get("/user/getLoginForm/recruiter",(req,res)=>{
    console.log("get hits")
    res.render("layouts", {body : "recruiterLoginForm", errors : null});
})

recruiterRouter.post("/user/login/recruiter", async (req,res)=>{
    try{
        const{email,password: userPassword} = req.body;
        console.log(email,userPassword);
        const foundUser = await UserModel.findOne({email});
        console.log(foundUser.firstName);
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
            res.locals.User = "recruiter";
            res.render("layouts", {body : "homepage"})
        }else{
            console.log("error in password");
            throw new Error("Invalid Credentialsp");
        }
    }else{
        console.log("user not found");
        throw new Error("Invalid Credentials");
    }
    }catch(err){
        res.render("layouts", {body : "recruiterLoginForm", errors : err.message});
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
                res.locals.User = null;
                res.render("layouts", {body : "homepage", User:null})
            }
        })
    }catch(err){
        res.status(401).send(err.message);
    }
})

//get all applicants of a specific post
recruiterRouter.get("/user/allapplicants/recruiter/:id", auth,recruiterCheck,ownerCheck,async (req,res)=>{
    try{
        const{id} = req.params;
        const foundPost = await JobModel.findById(id);
        const allApplicants = foundPost.applicants;
        if (allApplicants.length > 0) {
            // Use Promise.all to fetch all applicant profiles asynchronously
            const applicantsData = await Promise.all(allApplicants.map(async (applicant) => {
                const thatApplicant = await UserModel.findById(applicant); // await the async operation

                // Return the applicant's relevant fields
                return {
                    firstName: thatApplicant.firstName,
                    email: thatApplicant.email,
                    phoneNumber: thatApplicant.phoneNumber,
                    resumeLink: thatApplicant.resumeLink
                };
            }));

            res.render("layouts", { body: "applicantLists", applicants: applicantsData, errors: null });
        } else{
            throw new Error("No applicants to show")
        } 
    }catch(err){
        res.render("layouts", {body : "applicantLists",applicants : null, errors: err.message});
    }
})






module.exports = recruiterRouter;