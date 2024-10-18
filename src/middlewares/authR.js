const UserModel = require("../model/userModel.js");
async function authR(req,res,next){
    try{
        if(req.session.userId){
            const userid = req.session.userId;
            const result = await UserModel.findById(userid);
            if(result){
                console.log("user is auth rec")
                next();
            }else{
                throw new Error("Please login again!!")
            }
            
        }else{
            throw new Error("Please login again!!")
        }
    }catch(err){
        res.render("layouts", {body : "recruiterLoginForm", errors : err.message});

    }
}

module.exports = {authR};