const validator = require("validator");
const {isValidNumber} = require("libphonenumber-js");

function validateUserRegistration(req,res,next){
    try{
        const{firstName,lastName,email,phoneNumber,password,gender,profileUrl,resumeLink,type,skills,expYears,company} = req.body;

        if(!firstName || firstName.length < 3){
            throw new Error("First name should be of atleast 3 characters long");
        }
        if(!email || !validator.isEmail(email)){
            throw new Error("Email should be valid");
        }
        if(!password || !validator.isStrongPassword(password)){
            throw new Error("Re-try with a strong password! md");
        }
        if(!phoneNumber || !isValidNumber(phoneNumber, 'IN')){
            throw new Error("Enter valid phone number");
        }
        if (!gender || !["male", "female", "others"].includes(gender.toLowerCase().trim())) {
            throw new Error("Enter correct gender");
        }        
        if(!profileUrl || !validator.isURL(profileUrl)){
            throw new Error("Enter valid Image URL md");
        }
        if(!resumeLink || !validator.isURL(resumeLink)){
            throw new Error("Enter valid Resume URL md");
        }
        if(!type || !["seeker", "recruiter"].includes(type.toLowerCase().trim())){
            throw new Error("Enter valid user type md");
        }
        if(!skills || skills.length < 2){
            throw new Error("Enter atleast 3 of your top skills md");
        }
        if(!expYears || expYears <= -1){
            throw new Error("Enter your experience in years md");
        }

        next();

    }catch(err){
        console.log(err);
        res.status(401).send(err);
    }
}

module.exports = {validateUserRegistration}



// {   
//     "firstName" : "Magnus",
//     "lastName" : "Sinha",
//     "email" : "magnus@gmail.com",
//     "phoneNumber" : "9878487689",
//     "password" : "Maggi@123",
//     "gender" : "female",
//     "profileUrl" : "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SX679_.jpg",
//     "resumeLink" : "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SX679_.jpg",
//     "type" : "seeker",
//     "skills" : ["html", "css", "js"],
//     "expYears" : "0",
//     "company" : "x"
// }