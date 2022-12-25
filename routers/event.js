const express = require('express');
const router = express.Router({ mergeParams: true });
const event = require('../controllers/event')
const { authJWT_RT, authJWT_AT } = require("../controllers/auth")
const { eventImageHandler } = require("../controllers/image")


router.route('/').get(authJWT_AT, event.getEvents)
router.route('/:eventid/owner').get(authJWT_AT, event.getEventOwner)

router.route('/register').post(
    // authJWT_AT,
    eventImageHandler.fields([
        { name: 'eventPic' },
        { name: 'eventBackgroundPic' },
    ]),
    event.createEvent)



router.route('/update/:evenid').patch(
    authJWT_AT,
    eventImageHandler.fields([
        { name: 'eventPic' },
        { name: 'eventBackgroundPic' },
    ]),
    event.updateEvent)

router.route('/info/:evenid').get(authJWT_AT, event.getEvent)
router.route('/delete/:evenid').delete(authJWT_AT, event.deleteEvent)

module.exports = router