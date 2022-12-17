const mongoose = require("mongoose");

const inviteSchma=new mongoose.Schema({
    eventName:{
        type:String,
        required:[true,'Invaild Eventname']
    },
    inviteTime: {
        type: Date,
        required: [true, "Invaild Invite Time"]
    },
    deepLink:{
        type:String,
    },
    invitedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Invaild UserId'],
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: [true, 'Invaild EventId'],
    }
})

