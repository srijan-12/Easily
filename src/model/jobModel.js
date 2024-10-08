const mongoose = require("mongoose");
const validator = require("validator");

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(value.length < 5 || value.length > 100){
                throw new Error(`Invalid title`);
            }
        }
    },
    description : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(value.length < 15 || value.length > 200){
                throw new Error(`Invalid description`);
            }
        }
    },
    category : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(!["tech", "non-tech"].includes(value)){
                throw new Error("Invalid category type")
            }
        }
    },
    designation : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(value.length < 5  || value.length > 100){
                throw new Error(`In valid designation`);
            }
        }
    },
    location : {
        type : [String],
        required : true,
        validate(value){
            if(value.length < 1 || value.length > 25){
                throw new Error(`Invalid location`);
            }
        }
    },
    company : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(value.length < 1 || value.length > 100){
                throw new Error(`Invalid Company`);
            }
        }
    },
    salary : {
        type : Number,
        trim : true,
        required : true,
        validate(value){
            if(value <= 0){
                throw new Error(`Invalid salary`);
            }
        }
    },
    exprienceReq : {
        type : Number,
        trim : true,
        required : true,
        validate(value){
            if(value < 0){
                throw new Error(`Invalid exprience`);
            }
        }
    },
    opeanings : {
        type : Number,
        trim : true,
        required : true,
        validate(value){
            if(value <= 0){
                throw new Error(`Invalid opeaning`);
            }
        }
    },
    skillsRequired : {
        type : [String],
        required : true,
        validate(value){
            if(value.length < 3 || value.length > 100){
                throw new Error(`Invalid skills`);
            }
        }
    },
    lastDateApply : {
        type : Date,
        required : true,
        validate(value){
            if(value < Date.now()){
                throw new Error(`Invalid date`);
            }
        }
    },
    postCreatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "UserModel"
    },

    applicants : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "UserModel"
    }
})

const JobModel = mongoose.model("JobModel", jobSchema);

module.exports = JobModel;













// {
//     "title": "Software Engineer",
//     "description": "Full-stack developer role",
//     "category": "tech",
//     "designation": "Senior Engineer",
//     "location": ["New York", "Remote"],
//     "company": "Tech Solutions Ltd.",
//     "salary": 120000,
//     "opeanings": 5,
//     "skillsRequired": ["JavaScript", "Node.js", "React"],
//     "lastDateApply": "2024-12-31",
//     "postCreatedBy": "64aeba2e2e0e5b0015d7e599"
// }
