const path = require("path")
const multer = require("multer")


const userImageHandler = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            fun(null, 'Images/users')
        },
        filename: (req, file, fun) => {
            console.log(file);
            let name=Date.now() + path.extname(file.originalname)
            req.profilePic=name
            fun(null,name)
        }
    })
})

const eventImageHandlerPicture = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            fun(null, 'Images/events/eventImage')
        },
        filename: (req, file, fun) => {
            console.log(file);
            let name=Date.now() + path.extname(file.originalname)
            req.eventPic=name
            fun(null, name)
        }
    })
})

const eventImageHandlerBackground = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            fun(null, 'Images/events/background')
        },
        filename: (req, file, fun) => {
            console.log(file);
            let name=Date.now() + path.extname(file.originalname)
            req.eventBackgroundPic=name
            fun(null, name)
        }
    })
})


module.exports = { 
    userImageHandler,
    eventImageHandlerPicture, 
    eventImageHandlerBackground 
}