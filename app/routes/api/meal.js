var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Task = require("../../models/task")
var Meal = require("../../models/meal")
var URL_BASE = "/admin/meals"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    try {
        var task = new Task({
            name: req.body._task.name,
            description: req.body._task.description,
            startTime: req.body._task.startTime,
            endTime: req.body._task.endTime,
            location: req.body._task.location,
            effort: req.body._task.effort,
            personsRequired: req.body._task.personsRequired,
            _contact: mongoose.Types.ObjectId(req.body._contact)
        })
        var data = new Meal({
            allergins: req.body.allergins,
            _task: task
        })
        data.save(function(err, data) {
            if (err) {
                return res.status(500).json({ "status" : 500, "message" : err.message })
            }
            return res.status(201).json({ "status" : 201, "data" : data })
        })
    } catch(err) {
        return res.status(500).json({ "status" : 500, "message" : err.message })
    }
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Meal.findById(req.params.id)
        .populate('_task._contact')
        .exec(function(err, data) {
            if (err) {
                res.status(404).json({ "status" : 404, "error" : err.message })
            } else {
                res.status(200).json({ "status" : 200, "data" : data })
            }
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Meal.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(500).json({ "status" : 500, "error" : err.message })
        } else {
            res.status(201).json({ "status" : 201, "data" : { "id" : req.body.id } })
        }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Meal.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(500).json({ "status" : 500, "message" : err.message })
        } else {
            res.status(204).json({ "status" : 204, "message" : "Deleted Successfully" })
        }
    })
})

module.exports = router
