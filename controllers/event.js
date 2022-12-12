require("express")
const event = require("../models/event")
const user = require("../models/user")
const invite = require("../models/invite")




module.exports.createEvent = async (req, res) => {
    // let userdata = (await user.find({ '_id': req.body.id }))[0]

    console.log(req.body);
    

    // let newEvent = new event({
    //     eventPic:{
    //         fileName:req.eventPic,
    //         url:`http://${process.env.HOST}:${process.env.PORT}/uploads/users/${req.eventPic}`
    //     },
    //     eventBackgroundPic:
    //     {
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
     let {profilePic,fullName,bio,joinedEvents}= await user.findOne({'_id':currentevent.ownerId})
     res.send(profilePic,fullName,bio,joinedEvents)
}