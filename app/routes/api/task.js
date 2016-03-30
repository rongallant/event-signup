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
    console.log('POST New item created.')
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
        duration: req.body.duration
    })
    data.save(function(err, data) {
        if (err) {
            console.error("Could not save task")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not save task", "error": err })
        }
        console.log('form body')
        console.log(req.body)
        console.log('data')
        console.log(data)
        return res.status(201).json({ "status": "201", "message": "Task created", "data": data })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Task.findById(req.params.id)
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find task")
                console.error(err)
                return res.status(404).json({ "status": "404", "message": "Could not find task", "error": err })
            }
            return res.status(200).json({ "status": "200", "data" : data })
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Task.findByIdAndUpdate(req.body.id, {$set:req.body})
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not update task")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not update task", "error": err })
            }
            return res.status(201).json({ "status" : 201, "data" : { "id" : req.body.id } })
        }
    )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Task.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete task", "error": err })
        }
        return res.status(204).json({ "status" : "204", "message" : "Deleted Successfully" })
    })
})

module.exports = router
