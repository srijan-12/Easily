const express = require("express");
const { auth } = require("../middlewares/auth");
const recruiterCheck = require("../middlewares/recruiterCheck");

const jobRouter = express.Router();

jobRouter.get("/job/getPostForm", auth,recruiterCheck,(req,res)=>{
    res.send("This js job form fill it up");
})

module.exports = jobRouter;