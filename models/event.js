const mongoose = require("mongoose");
const file = require("./file");

const eventSchema = new mongoose.Schema({
    eventBackgroundPic: file,
    sig: file,
    title: {
        type: String,
        required: [true, 'Invaild Event Name']
    },
    description: {
        type: String,
        default: 'None'
    },
    location: {
        type: String,
        default: 'None'
    },
    status: {
        // ['Upcoming', 'Open', 'Passed']
        type: Number,
        default: 0,
        enum: [0, 1, 2]
    },
    eventType: {
        //['Conference', 'Seminar']
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    startDateTime: {
        //2022-12-27T00:00:00.000Z
        type: Date,
        required: [true, "Invaild Start Date&Time"]
    },
    endDateTime: {
        //2022-12-27T00:00:00.000Z
        type: Date,
        required: [true, "Invaild End Date&Time"]
    },
    minAttendanceTime: {
        type: Number,
        default: 0,
        validate: {
            validator: (value) => {
                return value >= 0
            },
            message: 'Invaild Minimum Attendance Time'
        },
    },
    sets: {
        type: Number,
        default: 1,
        validate: {
            validator: (value) => {
                return value >= 1
            },
            message: 'Invaild Number Of Sets'
        },
    },
    Attenders: {
        type: Number,
        default: 0,
        validate: {
            validator: (value) => {
                return value >= 0
            },
            message: 'Invaild Number Of Attenders'
        },
    },
    Attended: {
        type: Number,
        default: 0,
        validate: {
            validator: (value) => {
                return value >= 0
            },
            message: 'Invaild Number Of Attended'
        },
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizations',
        required: [true, 'Invaild OrgId'],
    },
    eventMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        required: [true, 'Invaild MemberId'],
    },
    eventCerts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Certs',
        unique: true,
        required: [true, 'Invaild CertId'],
    },
    blackListed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        required: [true, 'Invaild BlackList ID'],
    },
})

module.exports = mongoose.model("Events", eventSchema);



