const express = require("express")()
const org = require("../models/org")
const token_collection = require("../models/token")
const RESPONSE = require("../utils/express_api_res")
const { hashSync, compareSync } = require('bcrypt')
const jwt = require("jsonwebtoken")
const event = require("../models/event")
const eventCons = require('./event')
const { removeUserFormEvents, removeEventFormUsers } = require("../utils/delete_from_arr")
require('../utils/delete_from_arr')



module.exports.createOrg = async (req, res) => {
    await new org({
        ...req.body.orgdata,
        orgPic:{
            fileName:req.orgPic,
            url:`http://${process.env.HOST}:${process.env.PORT}/uploads/org/orgimage/${req.orgPic}`
        },
        orgBackgroundPic:
        {
            fileName:req.orgBackgroundPic,
            url:`http://${process.env.HOST}:${process.env.PORT}/uploads/org/backgroundImage/${req.orgBackgroundPic}`
        },
        password: hashSync(req.body.orgdata.password, 12)
    }).save()
        
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Created"))
}
  
module.exports.deleteOrg = async (req, res) => {
    // let Orgid = req.logedinOrg.id  

    // //delete Org from all events 
    // removeOrgFormEvents(Orgid)
 
    // //delete any event Org made
    // // deleteOrgEvents_RemoveFromOrgs()

    // //delete all Org images
    // // deleteOrgImages()

    // await Org.findByIdAndDelete(Orgid)
    // res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Deleted"))
}

module.exports.updateOrg = async (req, res) => { 
    // await Org.findByIdAndUpdate(req.logedinOrg.id, {
    //    ... req.body.Orgdata,
    //    profilePic:{
    //     fileName:req.profilePic,
    //     url:`http://${process.env.HOST}:${process.env.PORT}/uploads/Orgs/${req.profilePic}`
    // },
    // password: hashSync(req.body.Orgdata.password, 12)
    // }) 
    // res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Updated"))
}


module.exports.getOrg = async (req, res) => {
    // res.send(await user.findOne({ '_id': req.params.id }))
}

module.exports.getLogedInOrg = async (req, res) => {
    // res.send(await user.findOne({ '_id': req.logedinUser.id }))
}


module.exports.login = async (req, res) => {

    let loginOrg = await org.findOne({ 'email': req.body.orgdata.email })

    if (!loginOrg) {
        return res.send("Org Not Found")
    }
    if (!compareSync(req.body.orgdata.password, loginOrg.password)) {
        return res.send("Incorrect Email or Password ")
    } 

    let AT = jwt.sign({
        id: loginOrg._id 
    }, process.env.ACCESS_TOKEN, { expiresIn: "5m", algorithm: "HS512" })

    let RT = jwt.sign({
        email: loginOrg.email,
        id: loginOrg._id
    }, process.env.REFRESH_TOKEN, { expiresIn: "2w", algorithm: "HS512" })


    let islogedIn=await token_collection.findOne({'orgId': loginOrg._id})

    if (islogedIn!=null) {
        await token_collection.findByIdAndUpdate(islogedIn._id,{
            $push:{"RT":RT}
        })
    }
    else{ 
        await new token_collection({
            'orgId': loginOrg._id,
            'RT': RT,
        }).save()
    }

    res.send(RESPONSE(res.statusMessage,res.statusCode,{
        AT: "Bearer " + AT,
        RT: "Bearer " + RT,
    }))
}


module.exports.logout = async (req, res) => {
    let anything=await token_collection.deleteMany({ 'orgId': req.logedinOrg.id })    
    res.send(RESPONSE(res.statusMessage, res.statusCode,anything.deletedCount<=0?"No Sessions To LogOut":"Loged Out"))
}