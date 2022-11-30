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
})

module.exports=mongoose.model("certificates",certificateSchema);