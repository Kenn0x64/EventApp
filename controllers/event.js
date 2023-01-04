const fs = require('fs')
const path = require("path") 
const event = require("../models/event")
const user = require("../models/user");
const org = require("../models/org")
const cert = require("../models/cert")
const PDF = require('pdf-lib').PDFDocument;
const { deleteImages, DateNowInMin, attendedInMin, RESPONSE } = require('../utils/shared_funs')
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
    let eventx = await event.findById(eventId)
    let userx = await user.findById(userId)

    let newCertName = Date.now() + '.pdf'

    if (eventx.eventMembers.includes(userId) == false && !userx.joinedEvents.includes(userId) == false) {
        res.send("User Must Join Event First")
        return
    }

    let certx = await new cert({
        userId: userId,
        eventId: eventx._id,
        orgId: eventx.orgId,
        checkInTime: DateNowInMin(),
        cert: {
            fileName: newCertName,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/certs/${newCertName}`,
        }
    }).save()

    let certs = await cert.find({})

    await eventx.updateOne({
        Attenders: certs.length
    })

    res.send("checkedIn")
}

module.exports.checkOut = async (req, res) => {

    //Check IF user is blocoked
    //Check If User is already checkedout 

    let eventId = req.params.eventId
    let userId = req.logedinUser.id
    let checkoutTime = DateNowInMin()
    let eventx = await event.findById(eventId)

    let certx = await cert.findOne({
        userId: userId,
        eventId: eventx._id,
        orgId: eventx.orgId,
    })

    let attendedMins = attendedInMin(checkoutTime, certx.checkInTime)
    let allowCert = attendedMins >= eventx.minAttendanceTime


    if (allowCert) {
        await certx.updateOne({
            checkoutTime,
            attendedMins,
            allowCert: allowCert
        })

        await eventx.updateOne({
            "$inc": { 'Attended': 1 },
            "$push": { eventCerts: certx._id }
        })

    } else {
        let certs = await cert.find({})
        await certx.deleteOne()
        await eventx.updateOne({
            Attenders: certs.length
        })
    }

    res.send("checked Out")
}

module.exports.genCerts = async (req, res) => {

    let file = ""
    let eventId = req.params.eventId
    let eventx = await event.findById(eventId).populate('eventCerts')

    //set paths
    let certs = path.join(`${__dirname}/..`, `/public/certs`)
    let sigs = path.join(`${__dirname}/..`, `/public/sigs`)

    //Confrance->0
    //read files
    if (eventx.eventType == 0) {
        file = fs.readFileSync(`${certs}/con.pdf`)
    } else {
        file = fs.readFileSync(`${certs}/sem.pdf`)
    }

    //check if user has 2 certs?
    eventx.eventCerts.forEach(async currentCert => {
        if (
            currentCert.eventId.toString() == eventx._id.toString() &&
            currentCert.orgId.toString() == eventx.orgId.toString() &&
            currentCert.allowCert
        ) {
            //load pdf and get page 
            const pdf = await PDF.load(file)
            const page = pdf.getPages()[0]

            //load image 
            const imageBuffer = fs.readFileSync(`${sigs}/${eventx.sig.fileName}`)
            const pngImage = await pdf.embedPng(imageBuffer)

            let userx = await user.findById(currentCert.userId)
            let orgx = await org.findById(eventx.orgId)

            //set text size
            page.setFontSize(18)

            //draw text
            page.drawText(userx.fullName, { x: 270, y: 630 })
            page.drawText(eventx.title, { x: 257, y: 570 })
            page.drawText(new Date().toLocaleDateString(), { x: 257, y: 515 })

            const { width, height } = pngImage.scale(0.3);
            page.drawImage(pngImage, { x: 190, y: 410, width, height }, page)

            //writeback to file system
            fs.writeFileSync(`public/certs/${currentCert.cert.fileName}`, await pdf.save())

            await cert.findByIdAndUpdate(currentCert._id, {
                allowCert: false
            })
        }
    });

    res.send({ "Result": "Generated Certs" })
}

