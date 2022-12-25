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


const orgImageHandler = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
            if (file.fieldname == 'orgPic') {
                fun(null, 'images/orgs/org_images')
            }
            else if (file.fieldname == 'orgBackgroundPic') {
                fun(null, 'images/orgs/background_images')
            }
        },
        filename: (req, file, fun) => {
            let name = Date.now() + path.extname(file.originalname)
            if (file.fieldname == 'orgPic') {
                req.orgPic = name
            }
            else if (file.fieldname == 'orgBackgroundPic') {
                req.orgBackgroundPic = name
            }
            fun(null, name)
        }
    })
})



const eventImageHandler = multer({
    storage: multer.diskStorage({
        destination: (req, file, fun) => {
                fun(null, 'images/events')
        },
        filename: (req, file, fun) => {
            let name = Date.now() + path.extname(file.originalname)
                req.eventPic = name
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



async function sendOrgImages(req, res) {
    
    images = path.join(__dirname, '../images/orgs')
    image = req.params.imageName
    o_bg= (req.params.o_bg).toLowerCase()
   
    if (o_bg == 'orgimage') {
        //HOST/uploads/orgs/orgImage/ImageName
        res.sendFile(`${images}/org_images/${image}`)
    }
    else if (o_bg == 'backgroundimage') {
        //HOST/uploads/org/backgroundImage/ImageName
        res.sendFile(`${images}/background_images/${image}`)
    }
    else{
        res.send("Hmm Something Is Not Right?")
    }
}


async function sendEventImages(req, res) {

    images = path.join(__dirname, '../images')
    image = req.params.imageName
    
    //HOST/uploads/users/ImageName
    res.sendFile(`${images}/events/${image}`)
}




module.exports = {
    sendUserImages,
    sendOrgImages,
    sendEventImages,
    orgImageHandler,
    userImageHandler,
    eventImageHandler,
}