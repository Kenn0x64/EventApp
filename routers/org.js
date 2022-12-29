const express = require('express');
const router = express.Router({ mergeParams: true });
const org = require('../controllers/org')
const { authJWT_RT, authJWT_AT } = require("../controllers/auth")
const { orgImageHandler } = require("../controllers/file_handler")

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



router.route('/:userId/:eventId').
    post(authJWT_AT, org.BLUser).
    delete(authJWT_AT, org.UBLUser)



module.exports = router

