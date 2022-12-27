const { number, bool } = require("joi");
const mongoose = require("mongoose");

const orgSchema= new mongoose.Schema({
    orgPic:{
        fileName:{
            type:String,
            unique:true,
        },
        url:String,
    },
    orgBackgroundPic:{
        fileName:{
            type:String,
            unique:true,
        },
        url:String,
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