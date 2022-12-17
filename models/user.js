const { number, bool } = require("joi");
const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    profilePic:{
        fileName:{
            type:String,
            unique:true,
        },
        url:String,
    },
    fullName:{
        type:String,
        required:[true,' Invaild FullName']
    },
    email:{
        type:String,
        required:[true,'Invaild Email'],
        unique:true,
        lowercase:true,
    }, 
    phoneNumber:{
        type:Number,
        unique:true,
        required:[true,'Invaild Phone Number']
    },
    password:{
        type:String,
        required:[true,'Invaild Password'],
    },
    bio:{
        type:String,
        required:[true,'Invaild Profile Bio'],
    },
    admin:{
        type:Boolean,
        default: '0',
    },
    joinedEvents:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'events',
    }
})
 
module.exports=mongoose.model("users",userSchema);