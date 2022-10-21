const express = require('express');
const router = express.Router({ mergeParams: true });
const event = require('../controllers/event')

router.route('/').get(event.getEvents)

router.route('/:eventid/owner').get(event.getEventOwner)

router.route('/register').post(event.createEvent)

router.route('/info/:evenid').get(event.getEvent)

router.route('/update/:evenid').put(event.updateEvent)

router.route('/delete/:evenid').delete(event.deleteEvent)

module.exports = router