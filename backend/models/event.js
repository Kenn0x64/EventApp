const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const imageSchma= require("../models/image")


const eventSchema = new Schema({
    eventPic:{
        type:imageSchma,
        required:[true,'Event Picture Is Required']
    },
    title: {
        type: String,
        required: [true, 'Event Name Required']
    },
    description: {
        type: String,
        required: [true, 'Discription Required']
    },
    location: {
        type: String,
        required: [true, 'Event Location Required']
    },
    startDateTime: {
        type: Date,
        required: [true, "Start Date & Time Required"]
    },
    endDateTime: {
        type: Date,
        required: [true, "End Date & Time Required"]
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Invaild host Id'],
    },
    eventMembers:{
        type: [Schema.Types.ObjectId],
        ref: 'users',
        required: [true, 'Invaild member Id'],
    },
    invitedMembers: {
        type: [Schema.Types.ObjectId],
        ref: 'users'
    }
})

module.exports = mongoose.model("events", eventSchema);



