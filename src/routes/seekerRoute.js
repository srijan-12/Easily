const express = require("express");
const seekerRouter = express.Router();
const {validateUserRegistration} = require("../middlewares/validateUserRegistration.js")
const UserModel = require("../model/userModel.js");
const {generateHashPassword} = require("../middlewares/hashPassword.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const {auth} = require("../middlewares/auth.js");









seekerRouter.get("/user/loginForm", (req,res)=>{
    res.send("login form!!!")
})




//registration
seekerRouter.post("/user/submitRegistrationForm",validateUserRegistration, async (req,res)=>{
    try{
        const{firstName,lastName,email,phoneNumber,password,gender,profileUrl,resumeLink,type,skills,expYears,company} = req.body;
        console.log(req.body);
        const hashedPassword = await generateHashPassword(password);
        console.log(hashedPassword);
        const userData = {firstName,lastName,email,phoneNumber,password : hashedPassword,gender,profileUrl,resumeLink,type : "seeker",skills,expYears,company};
        const newUser = new UserModel(userData);
        await newUser.save();
        res.status(200).send("validation");
    }catch(err){
        console.log(err.message);
        res.status(401).send(err.message);
    }
})





//login
seekerRouter.post("/user/login/seeker", async (req,res)=>{
    try{
        const{email,password: userPassword} = req.body;

        
        
        // console.log(email,password);
        const foundUser = await UserModel.findOne({email});
        // console.log(foundUser.firstName);
    if(foundUser){   
        const isValidated = await bcrypt.compare(userPassword, foundUser.password);
        if(isValidated){
            req.session.userId = foundUser._id;
            res.cookie("seekerID", foundUser._id);
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
                res.status(200).send("logged out");
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
