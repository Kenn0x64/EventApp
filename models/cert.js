const mongoose = require("mongoose");

const certificateSchema= new mongoose.Schema({
    checkInTime:{
        type:Date,
        default:new Date(0),
    },
    checkOutTime:{
        type:Date,
        default:new Date(0),
    },
    allowCert:{
        type:Boolean,
        default:false
    },
    attendedMins:{
        type:Number,
        default:0,
        validate:{
            validator:(value)=>{
                return value>=0
            },
            message:"Invaild Attendece Time"
        }
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

module.exports=mongoose.model("Certs",certificateSchema);