const express = require('express');
const router = express.Router({ mergeParams: true });
const org = require('../controllers/org')
const { authJWT_RT, authJWT_AT } = require("../controllers/auth")
const { orgImageHandler } = require("../controllers/file_handler")

//GET
router.route('/profile').get(authJWT_AT, org.getLogedInOrg)
router.route('/profile/:id').get(authJWT_AT, org.getOrg)
router.route('/events').get(authJWT_AT, org.getOrgEvents)

//POST
router.route('/login').post(org.login)
router.route('/logout').post(authJWT_RT, org.logout)
router.route('/:userId/:eventId').post(authJWT_AT, org.BLUser).delete(authJWT_AT, org.UBLUser)
router.route('/register').post(
    orgImageHandler.fields([
        { name: 'orgPic' },
        { name: 'orgBackgroundPic' },
    ]),
    org.createOrg)


//DELETE
router.route('/delete').delete(authJWT_AT, org.deleteOrg)


//PATCH
router.route('/update').patch(
    authJWT_AT,
    orgImageHandler.fields([
        { name: 'orgPic' },
        { name: 'orgBackgroundPic' },
    ]),
    org.updateOrg)


module.exports = router

