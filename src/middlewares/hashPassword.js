const bcrypt = require("bcrypt");

function generateHashPassword(password){
    const hashedPassword = bcrypt.hash(password,10);
    return hashedPassword;
}

module.exports = {generateHashPassword};