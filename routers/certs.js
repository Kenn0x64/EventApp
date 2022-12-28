const express = require('express');
const router = express.Router({ mergeParams: true });
const cert = require('../controllers/certificates')
const { authJWT_RT, authJWT_AT } = require("../controllers/auth")
const { orgImageHandler } = require("../controllers/image")

router.route('/login').post(org.login)
router.route('/logout').post(authJWT_RT, org.logout)

router.route('/profile').get(authJWT_AT, org.getLogedInOrg)
router.route('/profile/:id').get(authJWT_AT, org.getOrg)
router.route('/delete').delete(authJWT_AT, org.deleteOrg)


router.route('/register').post(
    orgImageHandler.fields([
        { name: 'orgPic' },
        { name: 'orgBackgroundPic' },
    ]),
    org.createOrg)


router.route('/update').patch(
    authJWT_AT,
    orgImageHandler.fields([
        { name: 'orgPic' },
        { name: 'orgBackgroundPic' },
    ]),
    org.updateOrg)


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

