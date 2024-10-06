const mongoose = require("mongoose");
const validator = require("validator");
const { validate } = require("./userModel");

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : true,
    },
    description : {
        type : String,
        trim : true,
        required : true,
    },
    category : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(!["tech", "non-tech"].includes(validate)){
                throw new Error("Invalid category type")
            }
        }
    },
    designation : {
        type : String,
        trim : true,
        required : true
    },
    location : {
        type : [String],
        required : true
    },
    company : {
        type : String,
        trim : true,
        required : true,
    },
    salary : {
        type : Number,
        trim : true,
        required : true,
    },
    opeanings : {
        type : Number,
        trim : true,
        required : true,
    },
    skillsRequired : {
        type : [String],
        required : true
    },
    lastDateApply : {
        type : Date,
        required : true
    },
    postCreatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "UserModel"
    },
})

const JobModel = mongoose.model("JobModel", jobSchema);

module.exports = JobModel;