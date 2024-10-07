const express = require("express");
const recruiterRouter = express.Router();
const {validateUserRegistrationForRecruiter} = require("../middlewares/validateUserRegistration.js")
const UserModel = require("../model/userModel.js");
const {generateHashPassword} = require("../middlewares/hashPassword.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const {auth} = require("../middlewares/auth.js");




recruiterRouter.get("/user/recruiter", (req,res)=>{
    res.send("recruiter login form!!!");
})


recruiterRouter.post("/user/submitRegistrationForm/recruiter",validateUserRegistrationForRecruiter, async (req,res)=>{
    try{
        const{firstName,lastName,email,phoneNumber,password,gender,profileUrl,resumeLink,type,skills,expYears,company} = req.body;
        console.log(req.body);
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


recruiterRouter.post("/user/login/recruiter", async (req,res)=>{
    try{
        const{email,password: userPassword} = req.body;
        // console.log(email,password);
        const foundUser = await UserModel.findOne({email});
        // console.log(foundUser.firstName);
    if(foundUser){   
        const isValidated = await bcrypt.compare(userPassword, foundUser.password);
        if(isValidated && foundUser.type === "recruiter"){
            req.session.userId = foundUser._id;
            res.cookie("recruiterId", foundUser._id);
            return res.send("loggedin" + foundUser);
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
                res.status(200).send("logged out");
            }
        })
    }catch(err){
        res.status(401).send(err.message);
    }
})


module.exports = recruiterRouter;