require('dotenv').config();
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
const seekerRouter = require("./src/routes/seekerRoute.js");
const recruiterRouter = require("./src/routes/recruiterRoute.js");
const jobRouter = require("./src/routes/jobRouter.js");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const methodOverride = require("method-override")

app.use(express.static(path.join(path.resolve(), "src", "public")));
app.use(methodOverride('_method'));
// app.use(express.json());
// app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "view"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.use(session({
    secret : "s3cR3tK3y!@$qW3rTy!9^kLpXyZ#8fBvNmA1",
    resave : false,
    saveUninitialized : true,
    cookie : {secret : false}
}))
app.use((req, res, next) => {
    if (req.cookies.seekerID) {
        res.locals.User = 'seeker';
    } else if (req.cookies.recruiterID) {
        res.locals.User = 'recruiter';
    } else {
        res.locals.User = null;
    }
    next();
});


app.use("/",seekerRouter);
app.use("/",recruiterRouter);
app.use("/",jobRouter);
// app.use("/",(req,res)=>{
//     res.render("layouts");
// })

//recruiter

























app.get("/check", auth, (req,res)=>{
    res.send("user is auth");
})

connectToDb().then(()=>{
    return app.listen(3000, (req,res)=>{
        console.log(`Server started`)
    })
}).catch((err)=>  console.log(err.message))
