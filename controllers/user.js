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


module.exports.createUser = async (req, res) => {
    await new user({
        ...req.body.userdata,
        profilePic: {
            fileName: req.profilePic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.profilePic}`
        },
        password: hashSync(req.body.userdata.password, 12)
    }).save()

    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Created"))
}



module.exports.updateUser = async (req, res) => {
    let userx = await user.findByIdAndUpdate(req.logedinUser.id, {
        ...req.body.userdata,
        profilePic: {
            fileName: req.profilePic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.profilePic}`
        },
        password: hashSync(req.body.userdata.password, 12)
    })

    deleteImages([
        path.join(`${__dirname}/..`, `/images/users/${userx.profilePic.fileName}`)
    ])

    res.send(RESPONSE(res.statusMessage, res.statusCode, "User Updated"))
}


module.exports.deleteUser = async (req, res) => {
    let userId = req.logedinUser.id
    let userx = await user.findByIdAndDelete(userId)


    deleteImages([
        path.join(`${__dirname}/..`, `/images/users/${userx.profilePic.fileName}`)
    ])

    await token_collection.deleteMany({ 'userId': userId })

    // Remove User From all events 
    
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

    let AT = jwt.sign({
        id: loginUser._id
    }, process.env.ACCESS_TOKEN, { expiresIn: "5m", algorithm: "HS512" })

    let RT = jwt.sign({
        email: loginUser.email,
        id: loginUser._id
    }, process.env.REFRESH_TOKEN, { expiresIn: "2w", algorithm: "HS512" })


    let islogedIn = await token_collection.findOne({ 'userId': loginUser._id })

    if (islogedIn != null) {
        await token_collection.findByIdAndUpdate(islogedIn._id, {
            $push: { "RT": RT }
        })
    }
    else {
        await new token_collection({
            'userId': loginUser._id,
            'RT': RT,
        }).save()
    }

    res.send(RESPONSE(res.statusMessage, res.statusCode, {
        AT: "Bearer " + AT,
        RT: "Bearer " + RT,
    }))
}


module.exports.logout = async (req, res) => {
    let anything = await token_collection.deleteMany({ 'userId': req.logedinUser.id })
    res.send(RESPONSE(res.statusMessage, res.statusCode, anything.deletedCount <= 0 ? "No Sessions To LogOut" : "Loged Out"))
}

module.exports.AddUserToEvent = async (req, res) => {

    let userId=req.logedinUser.id
    let eventId=req.params.eventId
    let evenx=await event.findById(eventId)

    if (evenx.blackListed.includes(userId)) {
        res.send("User Is Block ")
        return
    }

    //Check For Duplicts....
    await event.findOneAndUpdate(eventId,{
        "$push":{eventMembers:userId}
    })
    await user.findOneAndUpdate(userId,{
        "$push":{joinedEvents:eventId}
    })
    res.send(RESPONSE(res.statusMessage, res.statusCode,"User Added To Event"))
}

module.exports.RemoveUserToEvent = async (req, res) => {
     //Check For Duplicts....
    await event.findByIdAndUpdate(req.params.eventId,{
        "$pull":{eventMembers:req.logedinUser.id}
    })
    await user.findByIdAndUpdate(req.logedinUser.id,{
        "$pull":{joinedEvents:req.params.eventId}
    })
    res.send(RESPONSE(res.statusMessage, res.statusCode,"User Removed To Event"))
}

module.exports.getCertificate = async (req, res) => {
}


