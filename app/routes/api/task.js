var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Task = require("../../models/task")
var URL_BASE = "/admin/meals"

/************************************************************
 * REST API
 ************************************************************/

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    var populate = !req.query.simple ? '' : '_contact'
    Task.findById(req.params.id)
        .populate(populate)
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

/* POST New item created. */
router.post('/', function(req, res, next) {
    Task.create(req.body, function(err, data) {
        if (err) {
            console.error("Could not create task")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not create task", "error": err })
        }
        return res.status(200).json({ "status": "201", "message": "Task created", "data": data })
    })
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
            return res.status(200).json({ "status" : "201", "message": "Task updated", "data" : { "id" : req.body.id } })
        }
    )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Task.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete task", "error": err })
        } else if (data === null) {
            return res.status(404).json({ "status": "404", "message": "Task not found" })
        }
        return res.status(200).json({ "status": "200", "message": "Task deleted" })
    })
})

module.exports = router
