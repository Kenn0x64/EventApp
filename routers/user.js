const express = require('express');
const router = express.Router({mergeParams:true});
const user=require('../controllers/user')
const {authJWT_RT,authJWT_AT}=require("../utils/middlewares")



router.route('/register').post(user.createUser)
router.route('/login').post(user.login)

router.route('/profile').get(authJWT_AT,user.getUser)
router.route('/update').put(authJWT_AT,user.updateUser)
router.route('/delete').delete(authJWT_AT,user.deleteUser)
router.route('/logout').post(authJWT_RT,user.logout)


module.exports=router

