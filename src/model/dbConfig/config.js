const mongoose = require("mongoose");
const dbConnectionString = 'mongodb+srv://srijan122001:xtK4oshl7cpIQyKU@srijan.6nhyh.mongodb.net/easily';


async function connectToDb(){
    await mongoose.connect(dbConnectionString);
    console.log("db connected");
}

module.exports = connectToDb;