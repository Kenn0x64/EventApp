const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const userSchema= new Schema({
    userName:{
        type:String,
        required:[true,' userName Required']
    },
    email:{
        type:String,
        required:[true,'email Required']
    },
    password:{
        type:String,
        required:[true,'Password Required'],
    }
})

module.exports=mongoose.model("userModel",userSchema);