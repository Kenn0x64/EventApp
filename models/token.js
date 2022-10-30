const mongoose = require("mongoose");

const tokenSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true,'Invaild userID'],
    },
    RT:{
        type:[String],
        required:[true,'Invaild RT'],
    }
})

module.exports=mongoose.model("UTs",tokenSchema);