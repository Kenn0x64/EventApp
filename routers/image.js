const express = require('express');
const router = express.Router({ mergeParams: true });
const image = require('../controllers/image')
const { authJWT_RT, authJWT_AT } = require("../controllers/auth")


router.route('/users/:imageName').get(
    // authJWT_AT,
    image.sendUserImages)

router.route('/events/:imageName').get(
    // authJWT_AT,
    image.sendEventImages)

router.route('/org/:o_bg/:imageName').get(
    // authJWT_AT,
    image.sendOrgImages)


module.exports = router