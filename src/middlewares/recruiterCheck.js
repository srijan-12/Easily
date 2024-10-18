const UserModel = require("../model/userModel");


//ensures the login user must be a user of recruiter type
async function recruiterCheck(req,res,next){
    try{
        const {recruiterId} = req.cookies;
        if(!recruiterId){
            throw new Error("Please login again");
        }else{
            console.log(recruiterId);
            const foundUser = await UserModel.findById(recruiterId);
            console.log(foundUser);
            if(foundUser){
                const type = foundUser.type;
                if(type == "recruiter"){
                    next();
                }else{
                    throw new Error("Un-authorised access");
                }
            }else{
                throw new Error("User does not exists");
            }
        }
    }catch(err){
        console.log("error in recruiterCheck")
        res.render("layouts", {body : "recruiterLoginForm", errors : err.message});
    }
}

module.exports = recruiterCheck;