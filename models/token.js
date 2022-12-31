const mongoose = require("mongoose");

const tokenSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:'users',
    },
    orgId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:'orgs',
    },
    RT:{
        type:String,
        required:[true,'Invaild RT'],
    },
    imei:{
        type:String,
        default:null,
    },
})

module.exports=mongoose.model("Tokens",tokenSchema);