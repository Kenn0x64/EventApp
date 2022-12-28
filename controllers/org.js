const express = require("express")()
const org = require("../models/org")
const token_collection = require("../models/token")
const jwt = require("jsonwebtoken")
const path = require("path")
const {RESPONSE} = require("../utils/shared_funs")
const { hashSync, compareSync } = require('bcrypt')
const { deleteImages } = require('../utils/shared_funs')

module.exports.createOrg = async (req, res) => {
    await new org({
        ...req.body.orgdata,
        orgPic: {
            fileName: req.orgPic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/org/orgimage/${req.orgPic}`
        },
        orgBackgroundPic:
        {
            fileName: req.orgBackgroundPic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/org/backgroundImage/${req.orgBackgroundPic}`
        },
        password: hashSync(req.body.orgdata.password, 12)
    }).save()

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Created"))
}

module.exports.deleteOrg = async (req, res) => {
    let orgId = req.logedinOrg.id
    let orgx=await org.findOne({'_id':orgId}) 
    
    deleteImages([ 
        path.join(`${__dirname}/..`, `/images/orgs/org_images/${orgx.orgPic.fileName}`),
        path.join(`${__dirname}/..`, `/images/orgs/background_images/${orgx.orgBackgroundPic.fileName}`)
    ])

    await token_collection.deleteMany({ 'orgId': req.logedinOrg.id })
    
    await org.findByIdAndDelete(orgId)

    // //delete any event Org made
    // // deleteOrgEvents_RemoveFromOrgs()

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Deleted"))
}
 
module.exports.updateOrg = async (req, res) => {

    let orgx = await org.findByIdAndUpdate(req.logedinOrg.id, {
        ...req.body.orgdata,
        orgPic: {
            fileName: req.orgPic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/org/orgimage/${req.orgPic}`
        },
        orgBackgroundPic:
        {
            fileName: req.orgBackgroundPic,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/org/backgroundImage/${req.orgBackgroundPic}`
        },
        password: hashSync(req.body.orgdata.password, 12)
    })

    deleteImages([
        path.join(`${__dirname}/..`, `/images/orgs/org_images/${orgx.orgPic.fileName}`),
        path.join(`${__dirname}/..`, `/images/orgs/background_images/${orgx.orgBackgroundPic.fileName}`)
    ])

    res.send(RESPONSE(res.statusMessage, res.statusCode, "Org Updated"))
}

module.exports.getOrg = async (req, res) => {
    res.send(await org.findOne({ '_id': req.params.id }))
}

module.exports.getLogedInOrg = async (req, res) => {
    res.send(await org.findOne({ '_id': req.logedinOrg.id }))
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


    let islogedIn = await token_collection.findOne({ 'orgId': loginOrg._id })

    if (islogedIn != null) {
        await token_collection.findByIdAndUpdate(islogedIn._id, {
            $push: { "RT": RT }
        })
    }
    else {
        await new token_collection({
            'orgId': loginOrg._id,
            'RT': RT,
        }).save()
    }

    res.send(RESPONSE(res.statusMessage, res.statusCode, {
        AT: "Bearer " + AT,
        RT: "Bearer " + RT,
    }))
}


module.exports.logout = async (req, res) => {
    let anything = await token_collection.deleteMany({ 'orgId': req.logedinOrg.id })
    res.send(RESPONSE(res.statusMessage, res.statusCode, anything.deletedCount <= 0 ? "No Sessions To LogOut" : "Loged Out"))
}

module.exports.removeUserFormEvent = async (req, res) => {
    // Get UserID From Query String
    // Get EventID From Params
    // Remove User From Event
}

