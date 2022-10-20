const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: [true, 'Event Name Required']
    },
    eventMembers: {
        type: [String],
    },
    invitedMembers: {
        type: [String],
    },
    startDateTime: {
        type: Date,
        required: [true, "Start Date & Tine Required"]
    },
    endDateTime: {
        type: Date,
        required: [true, "Start Date & Tine Required"]
    },
    owner:{
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'Invaild host Id'],
        },
        eventOwnerName: {
            type: String,
            required: [true, 'Event Owner Required']
        },
        
    }
})

module.exports = mongoose.model("events", eventSchema);



