const express = require("express")()
const user = require("../models/user")
const token_collection = require("../models/token")
const jwt = require("jsonwebtoken")
const path = require("path")
const event = require("../models/event")
const { RESPONSE } = require("../utils/shared_funs")
const { hashSync, compareSync } = require('bcrypt')
const { deleteImages } = require('../utils/shared_funs')
const { removeUserFormEvents, removeEventFormUsers } = require("../utils/delete_from_arr")



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
    let userx = await new user({
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
    }, process.env.ACCESS_TOKEN, { expiresIn: "15m", algorithm: "HS512" })

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
    let evenx = await event.findById(eventId)

    if (evenx.blackListed.includes(userId)) {
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
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Added To Event"))
}

module.exports.RemoveUserToEvent = async (req, res) => {
    //Check For Duplicts....
    await event.findByIdAndUpdate(req.params.eventId, {
        "$pull": { eventMembers: req.logedinUser.id }
    })
    await user.findByIdAndUpdate(req.logedinUser.id, {
        "$pull": { joinedEvents: req.params.eventId }
    })
    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Removed To Event"))
}

module.exports.getCertificate = async (req, res) => {
}


