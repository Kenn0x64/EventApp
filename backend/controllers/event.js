const event = require("../models/event")
const user = require("../models/user")
require("express")


module.exports.createEvent = async (req, res) => {
    let userdata = (await user.find({ '_id': req.body.id }))[0]

    let newEvent = new event({
        owner: {
            eventOwnerName: userdata.fullName,
            ownerId: req.body.id ,
        },
        ...req.body.eventdata,
    })
    newEvent.eventMembers.push(userdata.fullName)
    await newEvent.save()
}


module.exports.deleteEvent = async (req, res) => {
    await event.findByIdAndDelete(req.params.eventId)
}

module.exports.preUpdateEvent = async (req, res) => {
    res.send(await event.find({ '_id': req.params.eventId }))
}

module.exports.postUpdateEvent = async (req, res) => {
    await event.findByIdAndUpdate(req.params.eventId, req.body.eventdata)
    res.redirect()
}


module.exports.getEvent = async (req, res) => {
    res.send( await event.find({'_id':req.params.eventId}))
}

module.exports.getEvents = async (req, res) => {
    res.send(await event.find({}))
}