const mongoose = require("mongoose");

const tokenSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    orgId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orgs',
        default:null
    },
    RT:{
        type:[String],
        required:[true,'Invaild RT'],
    }
})

module.exports=mongoose.model("TSchema",tokenSchema);