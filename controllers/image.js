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

const eventImageHandlerPicture = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            console.log(file); 
            fun(null, 'images/events/eventImage')
        },
        filename: (req, file, fun) => {
            let name = Date.now() + path.extname(file.originalname)
            req.eventPic = name
            fun(null, name)
        }
    })
})

const eventImageHandlerBackground = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) =>  {
            fun(null, 'images/events/background')
        },
        filename: (req, file, fun) => {
            let name = Date.now() + path.extname(file.originalname)
            req.eventBackgroundPic = name
            fun(null, name)
        }
    })
})


module.exports = {
    userImageHandler,
    eventImageHandlerPicture,
    eventImageHandlerBackground
}