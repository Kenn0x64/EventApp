const express = require("express")()
const user = require("../models/user")
const token_collection = require("../models/token")
const jwt = require("jsonwebtoken")
const path = require("path")
const event = require("../models/event")
const cert = require("../models/cert")
const { RESPONSE } = require("../utils/shared_funs")
const { hashSync, compareSync } = require('bcrypt')
const { deleteImages } = require('../utils/shared_funs')

function userImages(req, userx = {}) {
    const profilePic = {
        fileName: req.profilePic,
        url: `http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.profilePic}`
    }

    if (Object.keys(userx).length == 0) { return { profilePic } }

    const imagesToDelete = [
        path.join(`${__dirname}/..`, `/images/users/${userx.profilePic.fileName}`)
    ]
    return { profilePic, imagesToDelete }
}


module.exports.createUser = async (req, res) => {
    await new user({
        ...req.body.userdata,
        profilePic: userImages(req).profilePic,
        password: hashSync(req.body.userdata.password, 12)
    }).save()
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Created"))
}



module.exports.updateUser = async (req, res) => {
    let userx = await user.findByIdAndUpdate(req.logedinUser.id, {
        ...req.body.userdata,
        profilePic: userImages(req).profilePic,
        password: hashSync(req.body.userdata.password, 12)
    })
    deleteImages(userImages(req, userx).imagesToDelete)
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Updated"))
}


module.exports.deleteUser = async (req, res) => {
    // Remove User From all events 
    let userId = req.logedinUser.id
    let userx = await user.findByIdAndDelete(userId)
    deleteImages(userImages(req, userx).imagesToDelete)
    await token_collection.deleteMany({ 'userId': userId })
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Deleted"))

}

module.exports.getUser = async (req, res) => {
    res.send(await user.findOne({ '_id': req.params.id }))
}

module.exports.getLogedInUser = async (req, res) => {
    res.send(await user.findOne({ '_id': req.logedinUser.id }))
}

module.exports.login = async (req, res) => {

    let loginUser = await user.findOne({ 'email': req.body.userdata.email })

    if (!loginUser) {
        return res.send("User Not Found")
    }
    if (!compareSync(req.body.userdata.password, loginUser.password)) {
        return res.send("Incorrect Email or Password ")
    }

    const AT = jwt.sign({
        id: loginUser._id
    }, process.env.ACCESS_TOKEN, { expiresIn: "30m", algorithm: "HS512" })

    const RT = jwt.sign({
        id: loginUser._id,
        email: loginUser.email,
        imei:"NULL"
    }, process.env.REFRESH_TOKEN, { expiresIn: "2w", algorithm: "HS512" })


    await new token_collection({
        userId: loginUser._id,
        imei:"NULL",
        RT: RT,
    }).save()

    res.send(RESPONSE(res.statusMessage, res.statusCode, {
        AT: "Bearer " + AT,
        RT: "Bearer " + RT,
    }))
}


module.exports.logout = async (req, res) => {
    await token_collection.deleteMany({ 
        'userId': req.logedinUser.id,
        'RT':req.RT
    })

    res.send(RESPONSE(res.statusMessage, res.statusCode,"Loged Out"))
}

module.exports.AddUserToEvent = async (req, res) => {

    let userId = req.logedinUser.id
    let eventId = req.params.eventId
    let eventx = await event.findById(eventId)

    if (eventx.eventMembers.length>=eventx.sets) {
        res.send("No Sets Left ")
        return   
    }

    if (eventx.eventMembers.includes(userId)) {
        res.send("User Already Joined Event")
        return   
    }

    if (eventx.blackListed.includes(userId)) {
        res.send("User Is Block ")
        return
    }

    //Check For Duplicts....
    await event.findOneAndUpdate(eventId, {
        "$push": { eventMembers: userId }
    })
    await user.findOneAndUpdate(userId, {
        "$push": { joinedEvents: eventId }
    })

    await new cert({
     userId:userId,
     eventId:eventx._id,
     orgId:eventx.orgId,
    }).save()

    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Added To Event"))
}

module.exports.RemoveUserFromEvent = async (req, res) => {
    let userId=req.logedinUser.id
    let eventId=req.params.eventId
    let eventx = await event.findById(eventId)


    if (!eventx.eventMembers.includes(userId)) {
        res.send("User Is Not Event Member")
        return   
    }

    await event.findByIdAndUpdate(eventx._id, {
        "$pull": { eventMembers: userId }
    })

    let userx=await user.findByIdAndUpdate(userId, {
        "$pull": { joinedEvents: eventId }
    })

    await cert.findOneAndDelete({
        userId:userx._id,
        eventId:eventx._id,
        orgId:eventx.orgId,
    })

    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Removed To Event"))
}

module.exports.getCertificate = async (req, res) => {
}


