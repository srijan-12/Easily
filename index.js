const express = require("express");
const app = express();
const router = require("express-router");
const connectToDb = require("./src/model/dbConfig/config.js");
const {validateUserRegistration} = require("./src/middlewares/validateUserRegistration.js")
const UserModel = require("./src/model/userModel.js");


// app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get("/user/loginForm", (req,res)=>{
    res.send("login form!!!")
})

app.post("/user/submitLoginForm",validateUserRegistration, async (req,res)=>{
    try{
        const{firstName,lastName,email,phoneNumber,password,gender,profileUrl,resumeLink,type,skills,expYears,company} = req.body;
        console.log(req.body);
        const userData = {firstName,lastName,email,phoneNumber,password,gender,profileUrl,resumeLink,type,skills,expYears,company};
        const newUser = new UserModel(userData);
        await newUser.save();
        res.status(200).send("validation");
    }catch(err){
        console.log(err.message);
        res.status(401).send(err);
    }
})


connectToDb().then(()=>{
    return app.listen(3000, (req,res)=>{
        console.log(`Server started`)
    })
}).catch((err)=>  console.log(err.message))
