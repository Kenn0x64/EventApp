const event = require("../models/event")
const org = require("../models/org")
const path = require("path")
const cert = require("../models/cert")
const { deleteImages, DateNowInMin, attendedInMin } = require('../utils/shared_funs')
const { RESPONSE } = require("../utils/shared_funs")
require("express")

function eventImages(req, eventx = {}) {

    const eventBackgroundPic = {
        fileName: req.eventPic,
        url: `http://${process.env.HOST}:${process.env.PORT}/uploads/events/${req.eventPic}`
    }
    const sig = {
        fileName: req.sig,
        url: `http://${process.env.HOST}:${process.env.PORT}/uploads/sigs/${req.sig}`
    }

    if (Object.keys(eventx).length == 0) { return { eventBackgroundPic, sig, } }

    const imagesToDelete = [
        path.join(`${__dirname}/..`, `/images/events/${eventx.eventBackgroundPic.fileName}`),
        path.join(`${__dirname}/..`, `/public/sigs/${eventx.sig.fileName}`)
    ]

    return { eventBackgroundPic, sig, imagesToDelete }
}

module.exports.createEvent = async (req, res) => {
    let orgId = req.logedinOrg.id
    if (!req.logedinOrg) {
        res.send("No Org")
    }
    let eventx = await new event({
        eventBackgroundPic: eventImages(req).eventBackgroundPic,
        sig: eventImages(req).sig,
        orgId: orgId,
        ...req.body.eventdata,
    }).save()

    await org.findByIdAndUpdate(orgId, {
        "$push": { orgEvents: eventx._id }
    })

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Event Created"))
}
module.exports.updateEvent = async (req, res) => {
    let orgId = req.logedinOrg.id
    let eventx = await event.findByIdAndUpdate(req.params.eventId,
        {
            eventBackgroundPic: eventImages(req).eventBackgroundPic,
            sig: eventImages(req).sig,
            orgId: orgId,
            ...req.body.eventdata,
        })

    deleteImages(eventImages(req).imagesToDelete)
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Event Updated"))
}

module.exports.deleteEvent = async (req, res) => {
    let eventId = req.params.eventId
    let orgId = req.logedinOrg.id

    let eventx = await event.findByIdAndDelete(eventId)
    deleteImages(eventImages(req, eventx).imagesToDelete)

    // Remove event from all users

    // Delete All cert Files

    await cert.deleteMany({
        eventId: eventx._id,
    })

    await org.findByIdAndUpdate(orgId, {
        "$pull": { orgEvents: eventx._id }
    })

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Event Deleted"))
}


module.exports.getEvent = async (req, res) => {
    res.send(await event.findOne({ '_id': req.params.eventId }))
}

module.exports.getEvents = async (req, res) => {
    res.send(await event.find({}))
}

module.exports.getEventOwner = async (req, res) => {
    eventx = await event.findOne({ '_id': req.params.eventId })
    let orgx = await org.findOne({ '_id': eventx.orgId })
    res.send(orgx)
}

module.exports.getEventMembers = async (req, res) => {
    let eventx = await event.find({ eventId: req.params.eventId })
    res.send({ "EventMembers": eventx.eventMembers })
}

module.exports.getBlockedMembers = async (req, res) => {
    let eventx = await event.findById({ '_id': req.params.eventId })
    res.send({ "BlackListedMembers": eventx.blackListed })
}

module.exports.checkIn = async (req, res) => {
    //Check IF user is blocoked
    let eventId = req.params.eventId
    let userId = req.logedinUser.id
    let eventx = await event.findByIdAndUpdate(eventId,{
        "$inc":{Attenders:1}
    })

    let certx = await cert.findOneAndUpdate({
        userId: userId,
        eventId: eventx._id,
        orgId: eventx.orgId
    }, {
        checkInTime: DateNowInMin()
    })

    res.send("checkedIn")
}

module.exports.checkOut = async (req, res) => {

    //Check IF user is blocoked

    let eventId = req.params.eventId
    let userId = req.logedinUser.id
    let checkoutTime = DateNowInMin()

    let eventx = await event.findByIdAndUpdate(eventId,{
        "$inc":{Attenders:-1}
    })

    let certx = await cert.findOne({
        userId: userId,
        eventId: eventx._id,
        orgId: eventx.orgId
    })

    let attendedMins = attendedInMin(checkoutTime, certx.checkInTime)

    if (attendedMins >= eventx.minAttendanceTime) {

        await certx.updateOne({
            checkoutTime,
            attendedMins,
            allowGen: attendedMins >= eventx.minAttendanceTime ? true : false
        })

        await eventx.updateOne({
            "$inc": { 'Attended': 1 },
            "$push": { eventCerts: certx._id }
        })

    } else {
        await certx.deleteOne()
    }

    res.send("checked Out")
}

module.exports.genCerts = async (req, res) => {
    
    // Generate Certificates Of All Users
    // HOST/event/certificate/:eventid
}

