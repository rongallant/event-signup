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

// Update activities
function addActivities(activities, eventId) {
    if (activities !== 'undefined' && activities) {
        for (var i in activities) {
            var activity = new Activity(activities[i])
            activity._event = mongoose.Types.ObjectId(eventId)
            activity.save(function(err, activity) {
                    if (err) { console.error(err) }
                    console.log('Saved activity')
                }
            )
        }
    }
}

// Update meals
function addMeals(meals, eventId) {
    if (meals !== 'undefined' && meals) {
        for (var i in meals) {
            new Meal({
                _event: mongoose.Types.ObjectId(eventId)
            }).save(function(err, activity) {
                if (err) { console.error(err) }
                console.log('Saved meal')
            })
        }
    }
}

/* CREATE */
router.post('/', function(req, res, next) {
    console.log("Create new event")
    var newEvent = new Event({
        name: req.body.name,
        description: req.body['description'],
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        duration: req.body.duration,
        _contact: mongoose.Types.ObjectId(req.body._contact),
        address: req.body.address // This is an embedded doc working
    }).save(function(err, data) {
        if (err) {
            console.error("Error saving event")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Error saving event", "error": err })
        } else {
            addActivities(req.body.activityArray, newEvent._id)
            return res.status(201).json({ "status": "201", "message": "Address added to event", "data": data })
        }
    })
})

/* GET Single Event. */
router.get('/:id', function(req, res, next) {
    Event.findById(req.params.id)
        .populate('_contact _event tasks activities')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find event")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not find event", "error": err })
            } else if (!data) {
                return res.status(404).json({ "status": "500", "message": "Event not found" })
            } else {
                return res.status(200).json({ "status": "200", "data": data })
            }
        }
    )
})

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
    req.body.endDateTime = dateTimeToDate(req.body.endDate, req.body.endTime)
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
    })
})

router.put('/deactivate/:id', function(req, res, next) {
    Event.update({ _id: req.params.id }, { $set: { 'active': false }}, function(err, data) {
        if (err) {
            console.error("Could not update event")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not deactivated event" })
        }
        return res.status(201).json({ "status": "201", "message": "Event deactivated" })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ "status" : "500", "message" : "Could not delete event", "error" : JSON.stringify(err) })
        }
        return res.status(204).json({ "status" : "204", "message" : "Event deleted" })
    })
})

module.exports = router
