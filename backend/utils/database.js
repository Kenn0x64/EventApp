let mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("\u2705 Database Connection Sucsessful!");
}).catch((e) => {
    console.log("\u274C ERROR WHILE CONNECTING TO DATABASE!\n");
    console.log(e);
})