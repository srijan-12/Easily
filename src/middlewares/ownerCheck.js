const JobModel = require("../model/jobModel.js");

//ensures the current loggedin user is a recruiter and owner of job poster
async function ownerCheck(req,res,next){
    try{
        const{id} = req.params;
        const foundPost = await JobModel.findById(id);
        if(foundPost){
            const postOwner = foundPost.postCreatedBy;
            const {recruiterId} = req.cookies;
            if(!recruiterId){
                throw new Error(`Please log in again`);
            }else{
                if(postOwner == recruiterId){
                    next();
                }else{
                    throw new Error("Only post owner can perform actions")
                }
            }
        }else{
            throw new Error("Invalid request Job post not found!!");
        }
    }catch(err){
        res.status(401).send(err.message);
    }
}

module.exports = ownerCheck;