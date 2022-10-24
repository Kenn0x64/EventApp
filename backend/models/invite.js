const { Schema } = require("mongoose");
const mongoose = require("mongoose");


module.exports=mongoose.model('invites',new Schema({
    eventname:{
        type:String,
        required:[true,' Invite Eventname Is Required']
    },
    description:{
        type:String,
        required:[true,'Invite Description Required']
    },
    invitetime: {
        type: Date,
        required: [true, "invitetime Required"]
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'events',
        required: [true, 'Invaild event Id'],
    }
}))