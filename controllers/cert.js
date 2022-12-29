const express = require("express")()
const cert = require("../models/cert")
const {RESPONSE} = require("../utils/shared_funs")


module.exports.createCert = async (req, res) => {     
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Cert Created"))
}
  
module.exports.deleteCert = async (req, res) => {
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Cert Deleted"))
}

module.exports.updateCert = async (req, res) => {  
    res.send(RESPONSE(res.statusMessage, res.statusCode, "Cert Updated"))
}

module.exports.getCert = async (req, res) => {
    res.send(await Cert.findOne({ '_id': req.params.id }))
}

module.exports.getCerts = async (req, res) => {
    res.send(await Cert.findOne({ '_id': req.logedinCert.id }))
}


module.exports.recordCheckin = async (req, res) => {
    // HOST/event/checkin/:eventid?userid
}

module.exports.recordCheckout = async (req, res) => {
    // HOST/event/checkout/:eventid?userid
}


