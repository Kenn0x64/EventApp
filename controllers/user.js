const express = require("express")()
const crypto = require("crypto")
const user = require("../models/user")
const token_collection = require("../models/token")
const RESPONSE = require("../utils/express_api_res")
const { hashSync, compareSync } = require('bcrypt')
const jwt = require("jsonwebtoken")
const event = require("../models/event")
const eventCons = require('../controllers/event')
require('../utils/delete_from_arr')



module.exports.createUser = async (req, res) => {
    //test
    await user.findOneAndDelete({'email':req.body.userdata.email})
    
    let newuser = await new user({
        ...req.body.userdata,
        password: hashSync(req.body.userdata.password, 12)
    }).save()
    
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Created"))
}

module.exports.deleteUser = async (req, res) => {
    //delete user from all events -> done
    //delete any events that current user owns
    //delete invites
    //delete all images in uploads

    let userid = req.logedinUser.id
    removeUserFormEvents(userid)
    await event.findOne(userid)
    
    await invite.findByIdAndDelete(userid)
    await user.findByIdAndDelete(userid)

    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Deleted"))
}

module.exports.updateUser = async (req, res) => {
    await user.findByIdAndUpdate(req.body.id, req.body.userdata)
    // res.redirect()
}


module.exports.getUser = async (req, res) => {
    res.send(await user.find({ '_id': req.body.id }))
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

    await new token_collection({
        'userId': loginUser._id,
        'RT': RT,
    }).save()

    res.send(RESPONSE(res.statusMessage,res.statusCode,{
        AT: "Bearer " + AT,
        RT: "Bearer " + RT
    }))
}

module.exports.logout = async (req, res) => {
    let anything=await token_collection.deleteMany({ 'userId': req.logedinUser.id })    
    res.send(RESPONSE(res.statusMessage, res.statusCode,anything.deletedCount<=0?"No Sessions To LogOut":"Loged Out"))
}