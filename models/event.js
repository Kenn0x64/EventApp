const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventBackgroundPic: {
        fileName: {
            type: String,
            unique: true,
        },
        url: String,
    },
    sig:{
        fileName: {
            type: String,
            unique: true,
        },
        url: String,
    },
    title: {
        type: String,
        required: [true, 'Invaild Event Name']
    },
    description: {
        type: String,
        required: [true, 'Invaild Discription']
    },
    location: {
        type: String,
        required: [true, 'Invaild Event Location']
    },
    startDateTime: {
        type: Date,
        default:Date.now,
        required: [true, "Invaild Start Date&Time"]
    },
    endDateTime: {
        //2022-12-27T00:00:00.000Z
        type: Date,
        default:Date.now,
        required: [true, "Invaild End Date&Time"]
    },
    minAttendanceTime: {
        type: Number,
        default:1,
        required: [(value)=>{value<0}, "Invaild Minimum Attendance Time"]
    },
    eventType:{
        type: [String],
        default:['Conference','Seminar'],
        required: [true, 'Invaild Type']
    },
    sets: {
        type: Number,
        required: [true, 'Invaild Sets']
    },
    numOfAttenders: {
        type: Number,
        default:0,
        required: [true, 'Invaild Num Of Attenders']
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orgs',
        required: [true, 'Invaild OrgId'],
    },
    eventMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: [true, 'Invaild MemberId'],
    },
    eventCerts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'certs',
        required: [true, 'Invaild CertId'],
    },
    blackListed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: [true, 'Invaild BLID'],
    }
})

module.exports = mongoose.model("events", eventSchema);



