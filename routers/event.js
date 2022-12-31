const express = require('express');
const router = express.Router({ mergeParams: true });
const event = require('../controllers/event')
const { authJWT_AT } = require("../controllers/auth")
const { eventImageHandler } = require("../controllers/file_handler")


//GET
router.route('/').get(authJWT_AT, event.getEvents)
router.route('/owner/:eventId').get(authJWT_AT, event.getEventOwner)

router.route('/info/:eventId').get(authJWT_AT, event.getEvent)
router.route('/members/:eventId').get(authJWT_AT, event.getEventMembers)

router.route('/certificate/:eventId').get(authJWT_AT, event.genCerts)
router.route('/blacklist/:eventId').get(authJWT_AT, event.getBlockedMembers)


//PATCH
router.route('/checkin/:eventId').patch(authJWT_AT, event.checkIn)
router.route('/checkout/:eventId').patch(authJWT_AT, event.checkOut)
router.route('/update/:eventId').patch(
    authJWT_AT,
    eventImageHandler.single('eventBackgroundPic'),
    event.updateEvent)


//POST
router.route('/register').post(
    authJWT_AT,
    eventImageHandler.fields([
        { name: 'eventBackgroundPic' },
        { name: 'sig' },
    ]),
    event.createEvent)



//DELETE
router.route('/delete/:eventId').delete(
    authJWT_AT,
    event.deleteEvent)


module.exports = router