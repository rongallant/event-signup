var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Meal = require("../../models/meal")
var URL_BASE = "/admin/meals"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    try {
        var data = new Meal({
            _contact: mongoose.Types.ObjectId(req.body._contact),
            _event: mongoose.Types.ObjectId(req.body._event),
            _task: mongoose.Types.ObjectId(req.body._task),
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            allergins: req.body.allergins, // Array
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            duration: req.body.duration
        })
        data.save(function(err, data) {
            if (err) {
                console.error("Could not save meal")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not save meal", "error": err })
            }
            return res.status(201).json({ "status": "201", "message": "Meal created", "data": data })
        })
    } catch(err) {
        console.error("Could not create meal")
        console.error(err)
        return res.status(500).json({ "status": "500", "message": "Could not create meal", "error": err })
    }
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Meal.findById(req.params.id)
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find meal")
                console.error(err)
                return res.status(404).json({ "status": "404", "message": "Could not find meal", "error": err })
            }
            return res.status(200).json({ "status": "200", "data" : data })
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Meal.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            console.error("Could not update meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not update meal", "error": err })
        }
        return res.status(201).json({ "status" : 201, "data" : { "id" : req.body.id } })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Meal.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete meal", "error": err })
        }
        return res.status(204).json({ "status" : "204", "message" : "Deleted Successfully" })
    })
})

module.exports = router
