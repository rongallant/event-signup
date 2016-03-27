var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Task = require("../../models/task")
var URL_BASE = "/admin/meals"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    var data = new Task({
        _contact: mongoose.Types.ObjectId(req.body._contact),
        _event: mongoose.Types.ObjectId(req.body._event),
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        effort: req.body.effort,
        personsRequired: req.body.personsRequired,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        endDate: req.body.endDate,
        endTime: req.body.endTime
    })
    data.save(function(err, data) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : JSON.stringify(err) })
        } else {
            res.status(201).json({ "status" : "success", data })
        }
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Task.findById(req.params.id)
        .populate('_contact')
        .exec(function(err, data) {

            console.table(data)

            if (err) {
                res.status(404).json({ "status" : "error", "error" : JSON.stringify(err) })
            } else {
                res.status(200).json({ "status" : "success", data })
            }
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Task.findByIdAndUpdate(req.body.id, {$set:req.body})
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                res.status(501).json({ "status" : "error", "error" : JSON.stringify(err) })
            } else {
                res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
            }
        }
    )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Task.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : JSON.stringify(err) })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
