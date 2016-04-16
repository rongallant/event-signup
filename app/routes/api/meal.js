var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Meal = require("../../models/meal")
var URL_BASE = "/admin/meals"

/************************************************************
 * REST API
 ************************************************************/

router.get('/:id', function(req, res, next) {
    var populate = !req.query.simple ? '' : '_contact'
    Meal.findById(req.params.id)
        .populate(populate)
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

/* POST New item created. */
router.post('/', function(req, res, next) {
    Meal.findById(req.body._id, function(err, data) {
        if (err) {
            console.error("Issue finding meal")
            return res.status(404).json({ "status": "404", "message": "Issue finding meal", "error": err })
        } else if (!data) {
            console.log('Creating new meal')
            data = new Meal(req.body)
        }
        data.save(function(err, data) {
            console.log('Updating meal')
            if (err) {
                console.error("Could not save meal")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not save meal", "error": err })
            }
            return res.status(201).json({ "status": "201", "message": "Meal created", "data": data })
        })
    })
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
    Meal.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete meal", "error": err })
        } else if (data === null) {
            return res.status(404).json({ "status": "404", "message": "Meal not found" })
        }
        return res.status(200).json({ "status": "200", "message": "Deleted Successfully" })
    })
})

module.exports = router
