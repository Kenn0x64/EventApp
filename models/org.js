const { number, bool } = require("joi");
const mongoose = require("mongoose");
const file = require("./file");

const orgSchema = new mongoose.Schema({
    orgPic: file,
    orgBackgroundPic:file,
    orgName: {
        type: String,
        required: [true, ' Invaild FullName']
    },
    email: {
        type: String,
        required: [true, 'Invaild Email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Invaild Password'],
    },
    phoneNumber: {
        type: Number,
        unique: true,
        required: [true, 'Invaild Phone Number Or Phone Number Is Already Used']
    },
    bio: {
        type: String,
        default: "None",
    },
    org_type: {
        // ['Organization','University', 'Company'],
        type: Number,
        default: 0,
        enum:[0,1,2]
    },
    location: {
        type: String,
        default: "None"
    },
    orgEvents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Events',
        unique:true, 
        required: [true, 'Invaild EventId'],
    }
})

module.exports = mongoose.model("Organizations", orgSchema);