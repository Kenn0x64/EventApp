const { number } = require("joi");
const mongoose = require("mongoose");

const certificateSchema= new mongoose.Schema({
    checkInTime:{
        type:Date,
        required:[true,'Invaild Checkin Time'],
    },
    checkOutTime:{
        type:Date,
        required:[true,'Invaild Checkout Time'],
    },
    attendedTime:{
        type:Number,
        required:[(value)=>{value<0},'Invaild Attendece Time'],
    },
    cert:{
        fileName: {
            type: String,
            unique: true,
        },
        url: String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        ref:'users'
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        ref:'events'
    },
    orgId:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        ref:'orgs'
    },
})

module.exports=mongoose.model("certs",certificateSchema);