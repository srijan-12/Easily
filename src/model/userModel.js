const mongoose = require("mongoose");
const validator = require("validator");
const userSchema  = new mongoose.Schema({
    firstName : {
        type : String,
        trim : true,
        required : true
    },

    lastName : {
        type : String,
        trim : true,
    },

    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email!");
            }
        }
    },

    phoneNumber : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },

    password : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Re-try with a strong password!")
            }
        }
    },

    gender : {
        type: String,
        required : true,
        trim : true,
        lowerCase : true,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Enter correct gender!")
            }
        }
    },

    profileUrl : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter valid Image URL")
            }
        }
    },

    resumeLink : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter valid Resume URL")
            }
        }
    },

    type : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(!["seeker", "recruiter"].includes(value)){
                throw new Error("Enter valid user type");
            }
        }
    },

    skills : {
        type : [String],
        trim : true,
    },

    expYears : {
        type : Number,
        required : true
    },

    company : {
        type : String,
        trim : true
    },
},{
    timestamps : true
});

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;