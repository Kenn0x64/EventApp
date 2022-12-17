const path = require("path")
const multer = require("multer")

const userImageHandler = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            fun(null, 'images/users')
        },
        filename: (req, file, fun) => {
            let name = Date.now() + path.extname(file.originalname)
            req.profilePic = name
            fun(null, name)
        }
    })
})

const eventImageHandler = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            if (file.fieldname == 'eventPic') {
                fun(null, 'images/events/event_images')
            }
            else if (file.fieldname == 'eventBackgroundPic') {
                fun(null, 'images/events/background_images')
            }
        },
        filename: (req, file, fun) => {
            let name = Date.now() + path.extname(file.originalname)
            if (file.fieldname == 'eventPic') {
                req.eventPic = name
            }
            else if (file.fieldname == 'eventBackgroundPic') {
                req.eventBackgroundPic = name
            }
            fun(null, name)
        }
    })
})


async function sendUserImages(req, res) {

    images = path.join(__dirname, '../images')
    image = req.params.imageName
    
    //HOST/uploads/users/ImageName
    res.sendFile(`${images}/users/${image}`)
}



async function sendEventImages(req, res) {

    images = path.join(__dirname, '../images/events')
    image = req.params.imageName
    EorB = (req.params.EorB).toLowerCase()
   

    if (EorB == 'eventimage') {
        //HOST/uploads/events/eventImage/ImageName
        res.sendFile(`${images}/event_images/${image}`)
    }
    else if (EorB == 'backgroundimage') {
        //HOST/uploads/events/backgroundImage/ImageName
        res.sendFile(`${images}/background_images/${image}`)
    }
    else{
        res.send("Hmm Something Is Not Right?")
    }
}




module.exports = {
    sendUserImages,
    sendEventImages,
    userImageHandler,
    eventImageHandler,
}