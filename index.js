const express = require("express");
const app = express();
const router = require("express-router");
const connectToDb = require("./src/model/dbConfig/config.js");



app.use("/", (req,res)=>{
    res.send("ok")
})


connectToDb().then(()=>{
    return app.listen(3000, (req,res)=>{
        console.log(`Server started`)
    })
}).catch((err)=>  console.log(err.message))