require("express")
const event = require("../models/event")
const org = require("../models/org")
const user = require("../models/user")


module.exports.createEvent = async (req, res) => {
    // let userdata = (await user.find({ '_id': req.body.id }))[0]

    res.send("Done")
    
    // let newEvent = new event({
    //     eventPic:{
    //         fileName:req.eventPic,
    //         url:`http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.eventPic}`
    //     },
    //     eventBackgroundPic:{
    //         fileName:req.eventBackgroundPic,
    //         url:`http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.eventBackgroundPic}`
    //     },
    //     owner: {
    //         eventOwnerName: userdata.fullName,
    //         ownerId: req.body.id,
    //     },
    //     ...req.body.eventdata,
    // })
    // newEvent.eventMembers.push(userdata.fullName)
    // await newEvent.save()
}


module.exports.deleteEvent = async (req, res) => {
    let users = await user.find({})

    for (let index = 0; index < users.length; index++) {
        joinedevents = users[index].joinedEvents
        for (let index = 0; index < joinedevents.length; index++) {
            if (joinedevents[index] === req.params.eventId) {
                joinedevents.pop(req.params.eventId)
            }
        }
    }

    //remove event from all users
    //..
    
    await invite.findByIdAndDelete(req.params.eventId)
    await event.findByIdAndDelete(req.params.eventId)
    res.redirect(`/`)
}

module.exports.updateEvent = async (req, res) => {
    await event.findByIdAndUpdate(req.params.eventId, req.body.eventdata)
    res.redirect(`/event/info/${req.params.eventId}`)
}


module.exports.getEvent = async (req, res) => {
    res.send(await event.findOne({ '_id': req.params.eventId }))
}

module.exports.getEvents = async (req, res) => {
    res.send(await event.find({}))
}

module.exports.getEventOwner = async (req, res) => {
     currentevent= await event.findOne({'_id':req.params.eventId})
     let {profilePic,fullName,bio,joinedEvents}= await org.findOne({'_id':currentevent.orgId})
     res.send(profilePic,fullName,bio,joinedEvents)
}

module.exports.getEventMembers = async (req, res) => {
    res.send(await event.find({eventId:req.params.eventId}))
}


module.exports.recordCheckin = async (req, res) => {
    // HOST/event/checkin/:eventid?userid
}

module.exports.recordCheckout = async (req, res) => {
    // HOST/event/checkout/:eventid?userid
}

module.exports.genCerts = async (req, res) => {
    // Generate Certificates Of All Users
    // HOST/event/certificate/:eventid
}

