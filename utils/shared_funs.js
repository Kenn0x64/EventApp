const fs = require('fs')
const path = require("path")
const crypto = require("crypto");
const { rgb } = require('pdf-lib');
const PDF = require('pdf-lib').PDFDocument;
const user = require("../models/user");
const event = require('../models/event');
const org = require('../models/org');
const certs = require('../models/cert');





function RESPONSE(status, code, result) {
    return {
        Status: status,
        StatusCode: code,
        Result: result
    }
}
function deleteImages(images) {
    images.forEach(image => {
        console.log(`image:${image} Deleted`);
        fs.unlink(image, (err) => {
            if (err) {
                console.log(err);
                return
            }
        })
    });
}

function handle(fun) {
    return (req, res, next) => {
        fun(req, res, next).catch(next)
    }
}


function genSessionID() {
    let time = Date.now()
    let rd = crypto.randomBytes(512).toString('hex')
    let hmac = crypto.createHmac('sha512', process.env.SEC || "X")
        .update(`${time}${rd}`)
        .digest('hex')
    return `${hmac}${time}${rd}`
}


function DateNowInMin() {
    return Math.floor(Date.now() / 60000)
}

function attendedInMin(checkin, checkout) {
    return checkin - checkout
}

async function genCert(eventId) {

    let eventx = await event.findById(eventId)
    let orgx = await org.findById(eventx.orgId)

    //set paths
    let certs = path.join(`${__dirname}/..`, `/public/certs`)
    let sigs = path.join(`${__dirname}/..`, `/public/sigs`)

    //read files
    const file = fs.readFileSync(`${certs}/base.pdf`)
    const imageBuffer = fs.readFileSync(`${sigs}/base.png`)

    //load pdf and get page 
    const pdf = await PDF.load(file)
    const page = pdf.getPages()[0]


    //load image 
    const pngImage = await pdf.embedPng(imageBuffer)


    eventx.eventCerts.forEach(async cert => {
        if (cert.eventId == eventx._id && cert.orgId == orgx._id && cert.allowCert) {
            let userx = await user.findById(cert.userId)
            let newcert = Date.now() + path.extname(file.originalname)

            //set text size
            page.setFontSize(18)

            //draw text
            page.drawText(userx.fullName, { x: 270, y: 630 })
            page.drawText(eventx.title, { x: 257, y: 570 })
            page.drawText(new Date().toLocaleDateString(), { x: 257, y: 515 })

            const { width, height } = pngImage.scale(0.3);
            page.drawImage(pngImage, { x: 190, y: 410, width, height }, page)

            //writeback to file system
            fs.writeFileSync(`public/certs/${newcert}`, await pdf.save())
        }
    });


}

module.exports = {
    RESPONSE,
    deleteImages,
    handle,
    genSessionID,
    DateNowInMin,
    attendedInMin,
    genCert
}
