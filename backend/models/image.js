const {Schema} = require("mongoose");

const ImageSchema= new Schema({
    filename:String,
    url:String
})

module.exports=ImageSchema

