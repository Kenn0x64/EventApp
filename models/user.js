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
    password:{
        type:String,
        required:[true,'Invaild Password'],
    },
    phoneNumber:{
        type:Number,
        unique:true,
        // required:[true,'Invaild Phone Number']
    },
    date_of_birth:{
        type:Date,
        // required:[true,'Invaild Age'],
    },
    university:{
        type:String,
        // required:[true,'Invaild University'],
    },
    faculty:{
        type:String,
        // required:[true,'Invaild Faculty'],
    },
    department:{
        type:String,
        // required:[true,'Invaild Faculty'],
    },
    scientific_title:{
        type:String,
        // required:[true,'Invaild Scientific Title'],
    },
    bio:{
        type:String,
        // required:[true,'Invaild Profile Bio'],
    },
    joinedEvents:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'events',
    }
})
 
module.exports=mongoose.model("users",userSchema);