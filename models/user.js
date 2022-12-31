const { number, bool } = require("joi");
const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    profilePic:{
        fileName:{
            type:String,
            default:"default.png",
            unique:true,
        },
        url:{
            type:String,
            default: `http://${process.env.HOST}:${process.env.PORT}/uploads/users/default.png`,
            unique:true,
        },
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
        required:[true,'Invaild Phone Number or Phone Number Is Already Used']
    },
    date_of_birth:{
        //2022-12-27T00:00:00.000Z
        type:Date,
        required:[true,'Invaild Age'],
    },
    university:{
        type:String,
        default:"None"
    },
    faculty:{
        type:String,
        default:"None"
    },
    department:{
        type:String,
        default:"None"
    },
    scientific_title:{
        type:String,
        default:"None"
    },
    bio:{
        type:String,
        default:"None",
    },
    joinedEvents:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'events',
        unique:true,
        required: [true, 'Invaild EventId'],
    },
})
 
module.exports=mongoose.model("Users",userSchema);