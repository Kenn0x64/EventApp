const express = require("express");
const jwt = require("jsonwebtoken");
const token_collection = require("../models/token")

function authJWT_RT(req, res, next) {
    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]
    let tokenInDb=token_collection.findOne({'RT':token})

    console.log(tokenInDb);

    if (token == null || tokenInDb == null) { return res.sendStatus(401) }

    jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) { res.sendStatus(403) }
        req.logedinUser = user
        req.RT=token
        next()
    })
}

function authJWT_AT(req, res, next) {
    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]

    if (token == null) { return res.sendStatus(401) }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) { res.sendStatus(403) }
        req.logedinUser = user
        next()
    })
}

module.exports = {authJWT_RT,authJWT_AT}