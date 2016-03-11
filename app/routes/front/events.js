var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Event = require("../../models/event"),
    Person = require("../../models/person"),
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

router.get('/signup',

// Get User ID
function(req, res, next) {
    try {
        Person.findOne({ "username" : req.user.username },  "_id", function(err, data){
            if (err) {
                console.error(err.message)
                return next(err)
            }
            console.log('Get User ID = ' + data)
            req.contactid = data.id
        return next()
        })
    } catch(err) {
        console.log("Error finding user: " + req.user.username)
        err = new Error("Error finding user")
        err.status = 500
        return next(err)
    }
},

// Get Users Reservation
function(req, res, next) {
    Reservation.findOne({ "_contact" : mongoose.Types.ObjectId(req.contactid) })
        .populate('activities _contact _contact.emergencyContact _event pets tasks')
        .exec(function(err, data){
            if (err) {
                console.error(err.message)
                return next(err)
            }
    console.log('Get Users Reservation')
    console.log('req.reservation = ' + req.reservation)
            req.reservation = data
            return next()
        }
    )
},

// Get Event
function(req, res, next) {

    if (hasVal(req.reservation)) {
       console.log(' req.reservation._contact = ' +  req.reservation._contact)
        console.log('req.reservation = ' + req.reservation)
    }


    if (hasVal(req.reservation)) { return next() }


    console.log('Get Latest Active Event')
    Event.findOne({"active" : true})
        .sort({ 'createdAt' : -1 })
        .exec(function(err, data) {
            if (err) {
                console.error(err.message)
                return next(err)
            }
            if (hasNoVal(data)) {
                console.log("No event was found")
                err = new Error("No event was found")
                err.status = 404
                return next(err)
            }
            // console.log('No active event found')
            console.log(data)
            req.event = data
            return next()
        }
    )
},
// Create new reservation
function(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    console.log("Create new reservation")
    try {

        console.log('req.user.id = ' + req.user.id)
        console.log('req.contactid = ' + req.contactid)

        req.reservation = new Reservation({
            _contact: mongoose.Types.ObjectId(req.contactid),
            _event: mongoose.Types.ObjectId(req.event.id),
            name: req.body.name,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        return next()
    } catch(err) {
        console.log("Error creating reservation")
        err = new Error("Error creating reservation")
        err.status = 500
        return next(err)
    }
},

// Render Reservation Page
function(req, res, next) {
    console.log(' Render Reservation Page')
    console.log('req.reservation = ' + req.reservation)
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
