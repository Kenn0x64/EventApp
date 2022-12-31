const { number, bool } = require("joi");
const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
    orgPic: {
        fileName: {
            type: String,
            default: "default.png",
            unique: true,
        },
        url: {
            type: String,
            default: `http://${process.env.HOST}:${process.env.PORT}/uploads/orgs/org_images/default.png`,
            unique: true,
        },
    },
    orgBackgroundPic: {
        fileName: {
            type: String,
            default: "default.png",
            unique: true,
        },
        url: {
            type: String,
            default: `http://${process.env.HOST}:${process.env.PORT}/uploads/orgs/background_images/default.png`,
            unique: true,
        },
    },
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
        ref: 'events',
        unique:true,
        required: [true, 'Invaild EventId'],
    }
})

module.exports = mongoose.model("Organizations", orgSchema);