require("express")
const user=require("../models/user")


module.exports.createUser= async(req,res)=>{
    await new user({
        ...req.body.userdata
    }).save()
}

module.exports.deleteUser= async(req,res)=>{
    //implement 
    //Delete every event With The Id of of user
    //await event.findByIdAndDelete(req.params.eventId)

    await  user.findByIdAndDelete(req.body.id)
    res.send(true)
}

module.exports.updateUser= async(req,res)=>{
    await user.findByIdAndUpdate(req.body.id,req.body.userdata)
    // res.redirect()
}


module.exports.getUser= async(req,res)=>{
    res.send(await user.find({'_id':req.body.id}))
}

module.exports.getUsers= async(req,res)=>{
    res.send(await user.find({}))
}

module.exports.login=async()=>{

}
module.exports.logout=async()=>{
    
}