const express = require("express")()
const user = require("../models/certificate")
const {RESPONSE} = require("../utils/shared_funs")
require('../utils/delete_from_arr')



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

