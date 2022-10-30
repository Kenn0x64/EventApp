const express = require('express');
const router = express.Router({ mergeParams: true });
const event = require('../controllers/event')
const { authJWT_RT, authJWT_AT } = require("../utils/middlewares")


router.route('/').get(authJWT_AT, event.getEvents)

router.route('/:eventid/owner').get(authJWT_AT, event.getEventOwner)

router.route('/register').post(authJWT_AT, event.createEvent)

router.route('/info/:evenid').get(authJWT_AT, event.getEvent)

router.route('/update/:evenid').put(authJWT_AT, event.updateEvent)

router.route('/delete/:evenid').delete(authJWT_AT, event.deleteEvent)

module.exports = router