var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose')

var Event = require("../../models/event")
var ScheduleDate = require("../../models/scheduleDate")

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {

    console.log("CREATE NEW EVENT")
    console.log('req.body')
    console.log(req.body)

    var data = new Event({
        _address: mongoose.Types.ObjectId(req.body._address),
        _contact: mongoose.Types.ObjectId(req.body._contact),
        name: req.body.name,
        description: req.body.description
    })

    console.log('schedules')
    console.table(req.body.schedules)

    for (var i in req.body.schedules) {
        console.log('ADD req.body.schedules[i].scheduleDay = ' + req.body.schedules[i].scheduleDay)
        data.schedules.push(new ScheduleDate({
            scheduleDay: req.body.schedules[i].scheduleDay,
            startTime: req.body.schedules[i].startTime,
            endTime: req.body.schedules[i].endTime
        }))
    }

    data.save(function(err, data) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(201).json({ "status" : "success", data })
        }
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    console.log("GET SINGLE EVENT")
    Event.findById(req.params.id)
        .populate('schedules _contact _address')
        .exec(function(err, data) {
            if (err) {
                res.status(404).json({ "status" : "error", "error" : err })
            } else {
                res.status(200).json({ "status" : "success", data })
            }
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Event.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
        }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
