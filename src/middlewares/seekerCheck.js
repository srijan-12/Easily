const UserModel = require("../model/userModel");

async function seekerCheck(req,res,next){
    try{
        const {seekerID,recruiterId} = req.cookies;
        if(recruiterId && !seekerID){
            throw new Error("Recruiter cannot apply for jobs");
        }
        else if(!seekerID){
            throw new Error("Please login again");
        }else{
            console.log(seekerID);
            const foundUser = await UserModel.findById(seekerID);
            console.log(foundUser);
            if(foundUser){
                const type = foundUser.type;
                if(type == "seeker"){
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
        res.status(400).send(err.message);
    }
}

module.exports = seekerCheck;