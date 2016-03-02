var express = require('express'),
    request = require('request'),
    passport = require('passport'),
    path = require("path"),
    router = express.Router(),
    Reservation = require("../models/reservation"),
    appSettings = require('./utils/appSettings')

var appDesc = []
appDesc['apiSingle'] = '/reservation'
appDesc['folder'] = '/events'
router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/signup', function(req, res, next) {
    res.render("front/events/signup", {
        title: "Event Signup",
        user: req.user,
        data: new Reservation()
    })
})

module.exports = router
