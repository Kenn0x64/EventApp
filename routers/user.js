const express = require('express');
const router = express.Router({mergeParams:true});
const user=require('../controllers/user')
const {authJWT_RT,authJWT_AT}=require("../controllers/auth")
const {userImageHandler} =require("../controllers/image")

router.route('/register').post(userImageHandler.single('profilePic'),user.createUser)
router.route('/login').post(user.login)

router.route('/logout').post(authJWT_RT,user.logout)

router.route('/update').put(authJWT_AT,userImageHandler.single('profilePic'),user.updateUser)
router.route('/delete').delete(authJWT_AT,user.deleteUser)
router.route('/profile').get(authJWT_AT,user.getLogedInUser)
router.route('/profile/:id').get(authJWT_AT,user.getUser)


module.exports=router

