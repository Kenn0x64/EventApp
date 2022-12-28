const event = require("../models/event")
const org = require("../models/org")
const path = require("path")
const { deleteImages } = require('../utils/shared_funs')
const { RESPONSE } = require("../utils/shared_funs")
require("express")

module.exports.createEvent = async (req, res) => {
    if (!req.logedinOrg) {
        res.send("No Org")
    }
    new event({
        eventBackgroundPic: {
            fileName: req.eventPic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/events/${req.eventPic}`
        },
        orgId: req.logedinOrg.id,
        ...req.body.eventdata,
    }).save()
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Event Created"))
}
module.exports.updateEvent = async (req, res) => {
    let eventx = await event.findByIdAndUpdate(req.params.eventId,
        {
            eventBackgroundPic: {
                fileName: req.eventPic,
                url: `http://${process.env.HOST}:${process.env.PORT}/uploads/events/${req.eventPic}`
            },
            orgId: req.logedinOrg.id,
            ...req.body.eventdata,
        })
    deleteImages([
        path.join(`${__dirname}/..`, `/images/events/${eventx.eventBackgroundPic.fileName}`)
    ])
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Event Updated"))
}

module.exports.deleteEvent = async (req, res) => {
    let eventx = await event.findByIdAndDelete(req.params.eventId)
    deleteImages([
        path.join(`${__dirname}/..`, `/images/events/${eventx.eventBackgroundPic.fileName}`)
    ])
    // Remove event from all users
    // Remove event from  orgOwner
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Event Deleted"))
}


module.exports.getEvent = async (req, res) => {
    res.send(await event.findOne({ '_id': req.params.eventId }))
}

module.exports.getEvents = async (req, res) => {
    res.send(await event.find({}))
}

module.exports.getEventOwner = async (req, res) => {
    currentevent = await event.findOne({ '_id': req.params.eventId })
    let orgx = await org.findOne({ '_id': currentevent.orgId })
    res.send(orgx)
}

module.exports.getEventMembers = async (req, res) => {
    let eventx = await event.find({ eventId: req.params.eventId })
    res.send({ "eventMembers": eventx.eventMembers })
}


module.exports.genCerts = async (req, res) => {
    // Generate Certificates Of All Users
    // HOST/event/certificate/:eventid
}

