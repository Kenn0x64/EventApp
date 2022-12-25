const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventBackgroundPic: {
        fileName: {
            type: String,
            unique: true,
        },
        url: String,
    },
    sets: {
        type: Number,
        required: [true, 'Invaild Sets']
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
        required: [true, "Invaild Start Date&Time"]
    },
    endDateTime: {
        type: Date,
        required: [true, "Invaild End Date&Time"]
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
})

module.exports = mongoose.model("events", eventSchema);



