var express = require('express'),
    router = express.Router(),
    request = require('request'),
    mongoose = require('mongoose')

var Reservation = require("../../models/reservation")
// var URL_BASE = "/admin/activities"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {

    // teamName: String,
    // arrivingDate: Date,
    // additionalInformation: String,
    // _event: { type: Schema.Types.ObjectId, ref: 'Event' },
    // _contact: { type: Schema.Types.ObjectId, ref: 'Person' }, // maybe Person
    // guests: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    // pets: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
    // events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    // activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]

    var data = new Reservation({
        name: req.body.name,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    })
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
    Reservation.findById(req.params.id)
        .populate('_contact')
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
    Reservation.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
        }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Reservation.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
