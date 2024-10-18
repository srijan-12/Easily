const express = require("express");
const seekerRouter = express.Router();
const {validateUserRegistration} = require("../middlewares/validateUserRegistration.js")
const UserModel = require("../model/userModel.js");
const {generateHashPassword} = require("../middlewares/hashPassword.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const {auth} = require("../middlewares/auth.js");
const uploadFiles = require("../../cloudConfig.js");
const JobModel = require("../model/jobModel.js");





// seekerRouter.get("/user/loginForm", (req,res)=>{
//     res.send("login form!!!")
// })

seekerRouter.get("/user/getRegistrationForm", (req,res)=>{
    res.render("layouts",{body : "seekerRegister", errors: null});
})


//registration validateUserRegistration
seekerRouter.post("/user/submitRegistrationForm",uploadFiles.fields([
    {name : "profileUrl", maxCount : 1}, 
    {name : "resumeLink", maxCount : 1}
    ]), validateUserRegistration,async (req,res)=>{
    try{
        const{firstName,lastName,email,phoneNumber,password,gender,skills,expYears,company} = req.body;
        console.log(skills);
        const profileUrl = req.files.profileUrl ? req.files.profileUrl[0].path : null;
        const resumeLink = req.files.resumeLink ? req.files.resumeLink[0].path : null;
        const hashedPassword = await generateHashPassword(password);
        const userData = {firstName,lastName,email,phoneNumber,password : hashedPassword,gender,profileUrl,resumeLink,type : "seeker",skills,expYears,company};
        const newUser = new UserModel(userData);
        await newUser.save();
        res.render("layouts", {body : "seekerLoginForm", errors : null});
    }catch(err){
        console.log(err.message);
        // res.status(401).send(err.message);
        res.render("layouts", {body : "seekerRegister", errors : err.message});
    }
})

seekerRouter.get("/user/getLoginForm/seeker",(req,res)=>{
    console.log("get hits")
    res.render("layouts", {body : "seekerLoginForm", errors : null});
})

//login
seekerRouter.post("/user/login/seeker", async (req,res)=>{
    try{
        console.log("post hits");
        const{email,password: userPassword} = req.body;
        const foundUser = await UserModel.findOne({email});
    if(foundUser){   
        const isValidated = await bcrypt.compare(userPassword, foundUser.password);
        if(isValidated && foundUser.type == "seeker"){
            const {recruiterId, seekerID} = req.cookies;
            // console.log(recruiterId, seekerID);
            if(recruiterId){
                res.clearCookie("recruiterId");
            }
            if(seekerID){
                res.clearCookie("seekerID");
            }
            req.session.userId = foundUser._id;
            res.cookie("seekerID", foundUser._id);
            const allJobsPosters = await JobModel.find({});
            res.locals.User = "seeker";
            if(allJobsPosters.length>0){
                res.render("layouts", {body : "jobPage", jobs : allJobsPosters, errors: null, recruiter:null, seeker:true})
            }else{
                res.render("layouts", {body : "jobPage", jobs : allJobsPosters, errors: "currently no jobs are available", recruiter:null, seeker:true})
            }
             
        }else{
            throw new Error("Invalid Credentialsp");
        }
    }else{
        console.log("user not found");
        throw new Error("Invalid Credentials");
    }
    }catch(err){
        res.render("layouts", {body : "seekerLoginForm", errors : err.message});
    }
});




//logout
seekerRouter.get("/user/logout/seeker", (req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                throw new Error("Log out could not be completed at this moment");
            }else{
                res.cookie("seekerID", null);
                res.clearCookie('connect.sid');
                res.clearCookie('seekerID');
                res.locals.User = "seeker";
                res.render("layouts", {body : "homepage", User:null})
            }
        })
    }catch(err){
        res.status(401).send(err.message);
    }
})



//auth checking
seekerRouter.get("/check", auth, (req,res)=>{
    res.send("user is auth");
})


module.exports = seekerRouter;
