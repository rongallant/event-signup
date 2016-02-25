var express = require('express'),
    mongoose = require('mongoose')
    // Review = require('../models/review')

var router = express.Router(),
    Event = require("../../models/event"),
    appSettings = require('../utils/appSettings')

var appDesc = []
appDesc['apiSingle'] = 'portal'
appDesc['apiCollection'] = '/portal'
appDesc['folder'] = '/portal'
appDesc['singularName'] = "Configuration"
appDesc['pluralName'] = "Configurations"
// appDesc['newObject'] = new Event()
router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})


router.get('/', function(req, res, next) {
    res.render('admin/portal', {
        title: 'Admin Portal'
    })
})

module.exports = router
