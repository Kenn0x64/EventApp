const express = require('express');
const router = express.Router({ mergeParams: true });
const image = require('../controllers/image')
const { authJWT_RT, authJWT_AT } = require("../utils/middlewares")


router.route('/users/:imageName').get(
    // authJWT_AT,
    image.sendUserImages)

router.route('/events/:EorB/:imageName').get(
    // authJWT_AT,
    image.sendEventImages)


module.exports = router