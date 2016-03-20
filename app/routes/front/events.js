var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Account = require("../../models/account"),
    Event = require("../../models/event"),
    Reservation = require("../../models/reservation"),
    appSettings = require('../utils/appSettings'),
    appDesc = []

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

// Get User ID
function getPersonId(req, res, next) {
    Account.findOne({ "username" : req.user.username },  "_person", function(err, data){
        if (err) {
            console.error(err)
            return next(err)
        }
        req.personId = data._person
        return next()
    })
}

// Get Users Reservation
function getUserReservation(req, res, next) {
    console.log({ "_contact" : mongoose.Types.ObjectId(req.personId) })
    Reservation.findOne({ "_contact" : mongoose.Types.ObjectId(req.personId) })
        .populate('activities _contact _contact.emergencyContact _event pets tasks')
        .exec(function(err, data){
            if (err) {
                console.log('Issue finding users reservation')
                console.error(err.message)
                return next(err)
            } else if (hasNoVal(data)) {
                console.log('Could not find users reservation')
                return next()
            } else {
                console.log('Found Users Reservation')
                // console.log(data)
                req.reservation = data
                return next()
            }
        }
    )
}

// Get Event
function getCurrentEvent(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    Event.findOne({"active" : true})
        .sort({ 'createdAt' : -1 })
        .select("_id")
        .exec(function(err, data) {
            if (err) {
                console.error(err.message)
                return next(err)
            } else if (hasNoVal(data)) {
                console.log("No event was found")
                err = new Error("No event was found")
                err.statusCode = 404
                return next(err)
            }
            // console.log("Found event")
            req.event = data
            return next()
        }
    )
}

// Create new reservation
function createNewReservation(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    try {
        req.reservation = new Reservation({
            _contact: mongoose.Types.ObjectId(req.personId),
            _event: mongoose.Types.ObjectId(req.event.id),
            name: req.body.name,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        // console.log("Created Reservation")
        return next()
    } catch(err) {
        console.log("Error creating reservation")
        err = new Error("Error creating reservation")
        err.statusCode = 500
        return next(err)
    }
}

// Render Reservation Page
router.get('/signup', getPersonId, getUserReservation, getCurrentEvent, createNewReservation, function(req, res, next) {
    console.log('Render Reservation Page')
    // console.log(req.reservation)
     
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
