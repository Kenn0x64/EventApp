const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const eventSchema = new Schema({
    eventName: {
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
    eventMembers:
    {
        type: [{
            memberId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: [true, 'Invaild member Id'],
            }
        }]
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
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Invaild host Id'],
    }
})

module.exports = mongoose.model("events", eventSchema);



