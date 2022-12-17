const express = require("express")()
const crypto = require("crypto")
const user = require("../models/user")
const token_collection = require("../models/token")
const RESPONSE = require("../utils/express_api_res")
const { hashSync, compareSync } = require('bcrypt')
const jwt = require("jsonwebtoken")
const event = require("../models/event")
const eventCons = require('../controllers/event')
const { removeUserFormEvents, removeEventFormUsers } = require("../utils/delete_from_arr")
require('../utils/delete_from_arr')



module.exports.createUser = async (req, res) => {
    await new user({
        ...req.body.userdata,
        profilePic:{
            fileName:req.profilePic,
            url:`http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.profilePic}`
        },
        password: hashSync(req.body.userdata.password, 12)
    }).save()
     
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Created"))
}

module.exports.deleteUser = async (req, res) => {
    let userid = req.logedinUser.id

    //delete user from all events 
    removeUserFormEvents(userid)

    //delete any event user made
    // deleteUserEvents_RemoveFromUsers()

    //delete all user images
    // deleteUserImages()

    await user.findByIdAndDelete(userid)
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Deleted"))
}

module.exports.updateUser = async (req, res) => { 
    await user.findByIdAndUpdate(req.logedinUser.id, {
       ... req.body.userdata,
       profilePic:{
        fileName:req.profilePic,
        url:`http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.profilePic}`
    },
    password: hashSync(req.body.userdata.password, 12)
    }) 

    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Updated"))
}


module.exports.getUser = async (req, res) => {
    res.send(await user.find({ '_id': req.logedinUser.id }))
}

module.exports.getUsers = async (req, res) => {
    res.send(await user.find({}))
}

module.exports.login = async (req, res) => {


    let loginUser = await user.findOne({ 'email': req.body.userdata.email })

    if (!loginUser) {
        return res.send("User Not Found")
    }
    if (!compareSync(req.body.userdata.password, loginUser.password)) {
        return res.send("Incorrect Email or Password ")
    } 

    let AT = jwt.sign({
        id: loginUser._id 
    }, process.env.ACCESS_TOKEN, { expiresIn: "5m", algorithm: "HS512" })

    let RT = jwt.sign({
        email: loginUser.email,
        id: loginUser._id
    }, process.env.REFRESH_TOKEN, { expiresIn: "2w", algorithm: "HS512" })


     let islogedIn=await token_collection.findOne({'userId': loginUser._id})

    if (islogedIn!=null) {
        await token_collection.findByIdAndUpdate(islogedIn._id,{
            $push:{"RT":RT}
        })
    }
    else{ 
        await new token_collection({
            'userId': loginUser._id,
            'RT': RT,
        }).save()
    }


    res.send(RESPONSE(res.statusMessage,res.statusCode,{
        AT: "Bearer " + AT,
        AT:  AT,
        RT: "Bearer " + RT,
        RT:  RT
    }))
}

module.exports.logout = async (req, res) => {
    let anything=await token_collection.deleteMany({ 'userId': req.logedinUser.id })    
    res.send(RESPONSE(res.statusMessage, res.statusCode,anything.deletedCount<=0?"No Sessions To LogOut":"Loged Out"))
}