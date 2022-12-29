const { number, bool } = require("joi");
const mongoose = require("mongoose");

const orgSchema= new mongoose.Schema({
    orgPic:{
        fileName:{
            type:String,
            default:"default.png",
            unique:true,
        },
        url:{
            type:String,
            default: `http://${process.env.HOST}:${process.env.PORT}/uploads/orgs/org_images/default.png`,
            unique:true,
        },
    },
    orgBackgroundPic:{
        fileName:{
            type:String,
            default:"default.png",
            unique:true,
        },
        url:{
            type:String,
            default:`http://${process.env.HOST}:${process.env.PORT}/uploads/orgs/background_images/default.png`,
            unique:true,
        },
    },
    orgName:{
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
        required:[true,'Invaild Phone Number']
    },
    bio:{
        type:String,
        default:"None",
        required:[true,'Invaild Profile Bio'],
    },
    org_type:{
        type:String,
        required:[true,'Invaild Org Type'],
    },
    location:{
        type:String,
        default:"None"
    },
    orgEvents:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'events',
    }
})
 
module.exports=mongoose.model("orgs",orgSchema);