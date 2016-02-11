var express = require('express')
var mongoose = require('mongoose')
// var Review = require('../models/review')

var router = express.Router()

var VIEW_FOLDER = "admin"
var URL_BASE = "/admin"
var entryName = "Configuration"
var entriesName = "Configurations"


router.get('/', function(req, res, next) {
    res.render(VIEW_FOLDER + '/portal', {
        title: 'Admin Portal'
    })
})

module.exports = router
