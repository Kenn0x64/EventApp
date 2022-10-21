const express = require('express');
const router = express.Router({mergeParams:true});
const user=require('../controllers/user')

router.route('/login').post(user.login)

router.route('/logout').get(user.logout)

router.route('/register').post(user.createUser)

router.route('/profile').get(user.getUser)

router.route('/update').put(user.updateUser)

router.route('/delete').delete(user.deleteUser)

module.exports=router