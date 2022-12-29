const express = require('express');
const router = express.Router({ mergeParams: true });
const cert = require('../controllers/cert')
const { authJWT_RT, authJWT_AT } = require("../controllers/auth")
const { certFileHandler } = require("../controllers/image")


///XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
router.route('checkin/:eventId').get(
    // HOST/event/checkin/:eventId ?userid
    authJWT_AT,
    event.recordCheckin)

router.route('/checkout/:eventId').get(
    // HOST/event/checkout/:eventId ?userid
    authJWT_AT,
    event.recordCheckout)



module.exports = router

