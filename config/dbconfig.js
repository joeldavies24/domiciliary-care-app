const mongoose = require("mongoose");
const mongoDB = "";

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(mongoDB);
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
    console.log("User has connected to the database");
});

module.exports = mongoose;