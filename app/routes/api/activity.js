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
    Activity.create(function(err, data) {
        console.log('Updating activity')
        if (err) {
            console.error("Could not save activity")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not save activity", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": "Activity created", "data": data })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    var populate = !req.query.simple ? '' : '_contact'
    Activity.findById(req.params.id)
        .populate(populate)
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status": "404", "message" : "Could not find activity", "error" : err })
            }
            return res.status(200).json({ "status": "200", "data": data })
        }
    )
})

/* POST New item created. */
router.post('/', function(req, res, next) {
    Activity.create(req.body, function(err, data) {
        if (err) {
            console.error("Could not create activity")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not create activity", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": "Activity created", "data": data })
    })
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Activity.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            return res.status(501).json({ "status": "501", "message": "Could not update activity", "error": err })
        }
        res.status(200).json({ "status": "200", "message": "Activity updated", "data": { "id" : req.body.id } })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Activity.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete activity", "error": err })
        } else if (!data) {
            return res.status(404).json({ "status": "404", "message": "Activity not found" })
        }
        return res.status(200).json({ "status": "200", "message": "Activity deleted" })
    })
})

module.exports = router