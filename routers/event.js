const express = require('express');
const router = express.Router({ mergeParams: true });
const event = require('../controllers/event')
const { authJWT_AT } = require("../controllers/auth")
const { eventImageHandler } = require("../controllers/image")


router.route('/').get(
    authJWT_AT,
    event.getEvents)


router.route('/owner/:eventId').get(
    authJWT_AT,
    event.getEventOwner)

router.route('/register').post(
    authJWT_AT,
    eventImageHandler.single('eventBackgroundPic'),
    event.createEvent)

router.route('/update/:eventId').patch(
    authJWT_AT,
    eventImageHandler.single('eventBackgroundPic'),
    event.updateEvent)

router.route('/delete/:eventId').delete(
    authJWT_AT,
    event.deleteEvent)


router.route('/info/:eventId').get(
    authJWT_AT,
    event.getEvent)


router.route('/members/:eventId').get(
    authJWT_AT,
    event.getEventMembers)



router.route('/certificate/:eventId').get(
    authJWT_AT,
    event.genCerts)


// router.route('/join/:eventId').get(authJWT_AT,event.getUser)




module.exports = router