var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Activity = require("../../models/activity"),
    Event = require("../../models/event"),
    Meal = require("../../models/meal")

/* global jQuery */

/************************************************************
 * REST API
 ************************************************************/

function hasVal(variable){
    return (variable !== 'undefined' && variable)
}

function isJson(jsonString) {
    try {
        jQuery.parseJSON(jsonString)
        return true
    } catch(e) {
        return false
    }
}


/* GET Latest Event. */
router.get('/current', function(req, res, next) {
    Event.findOne({active:true})
        .populate('_contact')
        .sort('-createdAt')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find event")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not find event", "error": err })
            } else if (!data) {
                return res.status(404).json({ "status": "500", "message": "Event not found" })
            } else {
                return res.status(200).json({ "status": "200", "message": "Found current event", "data": data })
            }
        }
    )
})

function dateTimeToDate(strDate, strTime) {
    return moment(strDate + ' ' + strTime, global.viewPatternDate + ' '+ global.viewPatternTime).format()
}

/* UPDATE Event. */
router.put('/', function(req, res, next) {
    req.body.startDateTime = dateTimeToDate(req.body.startDate, req.body.startTime)
    return next()
},
function(req, res, next) {
    Event.findByIdAndUpdate(req.body.id, { $set: req.body, upsert: true }, function(err, data) {
            if (err) {
                console.error("Could not update event")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not update event" })
            }
            addMeals(req.body.mealArray, req.body.id)
            addActivities(req.body.activityArray, req.body.id)
            return res.status(201).json({ "status": "201", "message": "Event updated", "data": { "id" : req.body.id } })
        }
    )
})

module.exports = router
