const UserModel = require("../model/userModel.js");
async function auth(req,res,next){
    try{
        if(req.session.userId){
            const userid = req.session.userId;
            const result = await UserModel.findById(userid);
            if(result){
                console.log("user is auth")
                next();
            }else{
                throw new Error("Please login again!!")
            }
            
        }else{
            throw new Error("Please login again!!")
        }
    }catch(err){
        res.status(401).send("Unauthorized: Please login again. render some views here auth middleware");

    }
}

module.exports = {auth};