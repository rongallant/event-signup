var express = require('express'),
    request = require('request'),
    router = express.Router(),
    Event = require("../../models/event"),
    Person = require("../../models/person"),
    Reservation = require("../../models/reservation"),
    appSettings = require('../utils/appSettings')

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

function hasVal(varName) {
    return (varName !== undefined) && (varName !== null)  && varName
}

function hasNoVal(varName) {
    return !hasVal(varName)
}

// Get Users Reservation
router.get('/signup', function(req, res, next) {
    Reservation.findOne({ '_contact.username' : req.user.username }, function(err, data){
        if (err) {
            console.error(err.message)
            return next(err)
        }
        req.reservation = data
        return next()
    })
},

// Get Event
function(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    Event.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, data) {
        if (err) {
            console.error(err.message)
            return next(err)
        }
        req.event = data
        return next()
    })
},

// Get Persons Details
function(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    Person.findOne({ 'username' : req.user.username })
        .populate('address')
        .populate('emergencyContact')
        .exec(function(err, data) {
            if (err) {
                console.error(err.message)
                return next(err)
            }
            req.person = data
            return next()
        }
    )
},
// Create New Reservation
function(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    req.reservation = new Reservation({
        _event: req.event,
        _contact: req.person,
        name: req.body.name,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    })
    return next()
},
// Build Reservation
function(req, res, next) {
    res.render("front/events/signup", {
        title: "Event Signup",
        user: req.user,
        data: req.reservation,
        formMethod: 'POST',
        formAction: res.locals.apiUri.secure.reservation.base,
        formComplete: res.locals.pageAccountHome
    })
})

module.exports = router
