var express = require('express'),
    request = require('request'),
    router = express.Router(),
    Event = require("../models/event"),
    Person = require("../models/person"),
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

// Get Event
router.get('/signup', function(req, res, next) {
    Event.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, data) {
        if (err) { console.log(err) }
        req.event = data
        return next()
    })
})

// Get Person
router.get('/signup', function(req, res, next) {
     Person.findOne({ 'username' : req.user.username })
        .populate('_address')
        .populate('_emergencyContact')
        .exec(function(err, rows) {
            if (err) { console.log(err) }
            req.person = rows
            return next()
    })
})
// Show Event Page
router.get('/signup', function(req, res, next) {
    var newReservation = new Reservation({
        _event: req.event,
        _contact: req.person,
        name: req.body.name,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    })
    res.render("front/events/signup", {
        title: "Event Signup",
        user: req.user,
        data: newReservation
    })
})

module.exports = router
