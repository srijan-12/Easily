const express = require("express");
const app = express();
const router = require("express-router");
const connectToDb = require("./src/model/dbConfig/config.js");
const {validateUserRegistration, validateUserRegistrationForRecruiter} = require("./src/middlewares/validateUserRegistration.js")
const UserModel = require("./src/model/userModel.js");
const {generateHashPassword} = require("./src/middlewares/hashPassword.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const {auth} = require("./src/middlewares/auth.js");




app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(session({
    secret : "s3cR3tK3y!@$qW3rTy!9^kLpXyZ#8fBvNmA1",
    resave : false,
    saveUninitialized : true,
    cookie : {secret : false}
}))



app.get("/user/loginForm", (req,res)=>{
    res.send("login form!!!")
})

app.post("/user/submitLoginForm",validateUserRegistration, async (req,res)=>{
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



app.post("/user/login/seeker", async (req,res)=>{
    try{
        const{email,password: userPassword} = req.body;
        // console.log(email,password);
        const foundUser = await UserModel.findOne({email});
        // console.log(foundUser.firstName);
    if(foundUser){   
        const isValidated = await bcrypt.compare(userPassword, foundUser.password);
        if(isValidated){
            req.session.userId = foundUser._id;
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





app.get("/user/logout/seeker", (req,res)=>{
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









//recruiter
app.get("/user/recruiter", (req,res)=>{
    res.send("recruiter login form!!!");
})


app.post("/user/submitLoginForm/recruiter",validateUserRegistrationForRecruiter, async (req,res)=>{
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


app.post("/user/login/recruiter", async (req,res)=>{
    try{
        const{email,password: userPassword} = req.body;
        // console.log(email,password);
        const foundUser = await UserModel.findOne({email});
        // console.log(foundUser.firstName);
    if(foundUser){   
        const isValidated = await bcrypt.compare(userPassword, foundUser.password);
        if(isValidated && foundUser.type === "recruiter"){
            req.session.userId = foundUser._id;
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

app.get("/user/logout/recruiter", (req,res)=>{
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
























app.get("/check", auth, (req,res)=>{
    res.send("user is auth");
})

connectToDb().then(()=>{
    return app.listen(3000, (req,res)=>{
        console.log(`Server started`)
    })
}).catch((err)=>  console.log(err.message))
