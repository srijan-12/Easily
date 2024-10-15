const multer = require("multer");
const path = require("path");

// // Storage configuration for Image 1 (Profile Picture)
// const storageConfigForImage1 = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const folder1 = path.join(path.resolve(), "src", "public", "profilePics");
//     cb(null, folder1);
//   },
//   filename: function (req, file, cb) {
//     const fileName1 = Date.now() + '-' + file.originalname;
//     cb(null, fileName1);
//   }
// });

// // Storage configuration for Image 2 (Resume)
// const storageConfigForImage2 = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const folder2 = path.join(path.resolve(), "src", "public", "resume");
//     cb(null, folder2);
//   },
//   filename: function (req, file, cb) {
//     const fileName2 = Date.now() + '-' + file.originalname;
//     cb(null, fileName2);
//   }
// });

// Combine storage configs for two fields
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === "profileUrl") {
        cb(null, path.join(path.resolve(), "src", "public", "profilePics"));
      } else if (file.fieldname === "resumeLink") {
        cb(null, path.join(path.resolve(), "src", "public", "resume"));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    }
  })
});

module.exports = upload;
