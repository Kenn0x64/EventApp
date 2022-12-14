const express = require('express');
const router = express.Router({mergeParams:true});
const user=require('../controllers/user')
const {authJWT_RT,authJWT_AT}=require("../controllers/auth")
const {userImageHandler} =require("../controllers/file_handler")

//GET
router.route('/profile').get(authJWT_AT,user.getLogedInUser)
router.route('/profile/:id').get(authJWT_AT,user.getUser)
router.route('/cert/:eventId').get(authJWT_AT,user.getCertificate)

//POST
router.route('/register').post(userImageHandler.single('profilePic'),user.createUser)
router.route('/login').post(user.login)
router.route('/logout').post(authJWT_RT,user.logout)

//PATCH
router.route('/update').patch(authJWT_AT,userImageHandler.single('profilePic'),user.updateUser)
router.route('/join/:eventId').patch(authJWT_AT,user.AddUserToEvent)

//DELETE
router.route('/delete').delete(authJWT_AT,user.deleteUser)
router.route('/quit/:eventId').delete(authJWT_AT,user.RemoveUserFromEvent)


module.exports=router
