const express = require("express")()
const org = require("../models/org")
const event = require("../models/event")
const user = require("../models/user")
const cert = require("../models/cert")
const token_collection = require("../models/token")
const jwt = require("jsonwebtoken")
const path = require("path")
const { RESPONSE } = require("../utils/shared_funs")
const { hashSync, compareSync } = require('bcrypt')
const { deleteImages } = require('../utils/shared_funs')

function orgImages(req, orgx = {}) {
    const orgPic = {
        fileName: req.orgPic,
        url: `http://${process.env.HOST}:${process.env.PORT}/uploads/orgs/org_images/${req.orgPic}`
    }

    const orgBackgroundPic = {
        fileName: req.orgBackgroundPic,
        url: `http://${process.env.HOST}:${process.env.PORT}/uploads/orgs/background_images/${req.orgBackgroundPic}`
    }


    if (Object.keys(orgx).length == 0) { return { orgPic, orgBackgroundPic } }

    const imagesToDelete = [
        path.join(`${__dirname}/..`, `/images/orgs/org_images/${orgx.orgPic.fileName}`),
        path.join(`${__dirname}/..`, `/images/orgs/background_images/${orgx.orgBackgroundPic.fileName}`)
    ]

    return { orgPic, orgBackgroundPic, imagesToDelete }

}
module.exports.createOrg = async (req, res) => {
    await new org({
        ...req.body.orgdata,
        orgPic: orgImages(req).orgPic,
        orgBackgroundPic: orgImages(req).orgBackgroundPic,
        password: hashSync(req.body.orgdata.password, 12)
    }).save()

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Created"))
}

module.exports.updateOrg = async (req, res) => {
    let orgId = req.logedinOrg.id

    let orgx = await org.findByIdAndUpdate(orgId, {
        ...req.body.orgdata,
        orgPic: orgImages(req).orgPic,
        orgBackgroundPic: orgImages(req).orgBackgroundPic,
        password: hashSync(req.body.orgdata.password, 12)
    })

    deleteImages(orgImages(req, orgx).imagesToDelete)
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Updated"))
}

module.exports.deleteOrg = async (req, res) => {
    let orgId = req.logedinOrg.id
    let orgx = await org.findByIdAndDelete(orgId)

    deleteImages(orgImages(req, orgx).imagesToDelete)

    await token_collection.deleteMany({ 'orgId': orgId })

    // Delete any event Org made
    // DeleteOrgEvents_RemoveFromOrgs()
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Deleted"))
}


module.exports.getOrg = async (req, res) => {
    res.send(await org.findOne({ '_id': req.params.id }))
}

module.exports.getLogedInOrg = async (req, res) => {
    res.send(await org.findOne({ '_id': req.logedinOrg.id }))
}


module.exports.login = async (req, res) => {

    let loginOrg = await org.findOne({ 'email': req.body.orgdata.email })

    if (!loginOrg) {
        return res.send("Org Not Found")
    }
    if (!compareSync(req.body.orgdata.password, loginOrg.password)) {
        return res.send("Incorrect Email or Password ")
    }

    let AT = jwt.sign({
        id: loginOrg._id
    }, process.env.ACCESS_TOKEN, { expiresIn: "15m", algorithm: "HS512" })

    let RT = jwt.sign({
        id: loginOrg._id,
        email: loginOrg.email,
        imei: "NULL",
    }, process.env.REFRESH_TOKEN, { expiresIn: "2w", algorithm: "HS512" })


    await new token_collection({
        orgId: loginOrg._id,
        imei: "NULL",
        RT: RT,
    }).save()

    res.send(RESPONSE(res.statusMessage, res.statusCode, {
        AT: "Bearer " + AT,
        RT: "Bearer " + RT,
    }))
}


module.exports.logout = async (req, res) => {
    await token_collection.findOneAndDelete({
        'orgId': req.logedinOrg.id,
        'RT': req.RT
    })

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Loged Out"))
}

module.exports.BLUser = async (req, res) => {
    userId = req.params.userId
    eventId = req.params.eventId

    // Check If User is already blocked

    let eventx = await event.findById(eventId)

    // Check If User is there or not
    let userx = await user.findByIdAndUpdate(userId, {
        "$pull": { 'joinedEvents': eventId }
    })

  let certx= await cert.findOneAndDelete({
        userId: userx._id,
        eventId: eventx._id,
        orgId: eventx.orgId,
    })
    
    //check if de attenders or attedeeded
    if (certx.allowCert) {
        await eventx.updateOne({
            "$push": { 'blackListed': userx._id },
            "$pull": { 'eventMembers': userx._id },
            "$pull": { eventCerts: certx._id },
            "$inc": { Attenders: -1 },
            "$inc": { Attended: -1 },
        })
    }else{
        await eventx.updateOne({
            "$push": { 'blackListed': userx._id },
            "$pull": { 'eventMembers': userx._id },
            "$pull": { eventCerts: certx._id },
            "$inc": { Attenders: -1 },
        })
    }

    res.send("User Blocked")
}

module.exports.UBLUser = async (req, res) => {
    userId = req.params.userId
    eventId = req.params.eventId

    // Check If User is there or not
    await event.findByIdAndUpdate(eventId, {
        "$pull": { 'blackListed': userId }
    })

    res.send("User UnBlocked")

}

module.exports.getOrgEvents = async (req, res) => {
    let orgId = req.logedinOrg.id
    let orgx = await org.findById(orgId)
    let orgEvents = orgx.orgEvents
    res.send({ "OrgEvents": orgEvents })
}




