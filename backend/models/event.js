const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const eventSchema= new Schema({
    eventName:{
        type:String,
        required:[true,'Event Name Required']
    },
    eventOwner:{
        type:String,
        required:[true,'Event Owner Required']
    },
    eventMembers:{
        type:[String],
        // required:[true,'Event Members Required'],
    },
    invitedMembers:{
        type:[String],
        // required:[true,'Event Members Required'],
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        required:[true,'OwnerId Required']
    },
    startDateTime:{
        type:Date,
        required: [true,"Start Date & Tine Required"]},
    endDateTime:{
        type:Date,
        required: [true,"Start Date & Tine Required"]}
})

module.exports=mongoose.model("eventModel",eventSchema);