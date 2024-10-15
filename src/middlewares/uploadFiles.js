const multer = require("multer");
const path = require("path");

const uploadFiles = multer.diskStorage({
    destination : function(req,file,cb){
        if(file.fieldname === "profileUrl"){
            const filePath = path.join(path.resolve(), "src", "public", "profilePics");
            cb(null, filePath);
        }else if(file.fieldname === "resumeLink"){
            const filePath = path.join(path.resolve(), "src", "public", "resume")
            cb(null,filePath);
        }
    },
    filename : function(req,file,cb){
        const names = Date.now() + '-' + file.originalname;
        cb(null,names);
    }
})

module.exports = multer({storage: uploadFiles});