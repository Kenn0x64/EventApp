const { number } = require("joi");
const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const imageSchma= require("../models/image")

const userSchema= new Schema({
    profilPic:{
        type:imageSchma,
        required:[true,'Profil Picture Is Required']
    },
    fullName:{
        type:String,
        required:[true,' FullName Required']
    },
    email:{
        type:String,
        required:[true,'Email Required']
    },
    phoneNumber:{
        type:Number,
        required:[true,'Phone Number Required']
    },
    password:{
        type:String,
        required:[true,'Password Required'],
    },
    bio:{
        type:String,
        required:[true,'Profile Bio Is Required'],
    },
    joinedEvents:{
        type: [Schema.Types.ObjectId],
        ref: 'events',
    },
    recivedInvites:{
        type: [Schema.Types.ObjectId],
        ref: 'invites',
    }
})

module.exports=mongoose.model("users",userSchema);