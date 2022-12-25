const express = require("express");
const jwt = require("jsonwebtoken");
const token_collection = require("../models/token")
const user = require("../models/user")
const org = require("../models/org");
const event = require("../models/event");

async function user_org(req,userORorg)
{
    let logedinOrg = await org.findOne({ '_id': userORorg.id })
    let logedinUser = await user.findOne({ '_id': userORorg.id })

    if (logedinOrg) {
        req.logedinOrg = logedinOrg
    } else if (logedinUser) {
        req.logedinUser = logedinUser
    }

}

async function authJWT_RT(req, res, next) {
    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]
    let tokenInDb = await token_collection.findOne({ 'RT': token })
 
    if (token == null || tokenInDb == null) { return res.sendStatus(401) }

    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, userORorg) => {
        if (err) { res.sendStatus(403) }
        await user_org(req,userORorg)
        req.RT = token
        next() 
    })
}

function authJWT_AT(req, res, next) {
    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]

    if (token == null) { return res.sendStatus(401) }

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, userORorg) => {
        if (err) { res.sendStatus(403) }
        await user_org(req,userORorg)
        next()
    })
}

module.exports = { authJWT_RT, authJWT_AT }