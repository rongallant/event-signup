var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Activity = require("../../models/activity")
var URL_BASE = "/admin/activities"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    Activity.findById(req.body._id, function(err, data) {
        if (err) {
            console.error("Issue finding activity")
            return res.status(404).json({ "status": "404", "message": "Issue finding activity", "error": err })
        } else if (!data) {
            console.log('Creating new activity')
            data = new Activity(req.body)
        }
        data.save(function(err, data) {
            console.log('Updating activity')
            if (err) {
                console.error("Could not save activity")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not save activity", "error": err })
            }
            return res.status(201).json({ "status": "201", "message": "Activity created", "data": data })
        })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    var populate = !req.query.simple ? '' : '_contact'
    Activity.findById(req.params.id)
        .populate(populate)
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : 404, "error" : err.message, "error" : JSON.stringify(err) })
            }
            return res.status(200).json({ "status" : 200, "data" : data })
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Activity.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            return res.status(501).json({ "status" : 501, "message" : err.message, "error" : JSON.stringify(err) })
        }
        res.status(201).json({ "status" : 201, "data" : {"id" : req.body.id} })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Activity.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete activity", "error": err })
        } else if (data === null) {
            return res.status(404).json({ "status": "404", "message": "Activity not found" })
        }
        return res.status(200).json({ "status": "200", "message": "Activity deleted" })
    })
})

module.exports = router