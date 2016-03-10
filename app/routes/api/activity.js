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
    new Activity({
        _contact: mongoose.Types.ObjectId(req.body._contact),
        name: req.body.name,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }).save(function(err, data) {
        if (err) {
            return res.status(501).json({ "status" : 501, "message" : err.message, "error" : JSON.stringify(err) })
        }
        return res.status(201).json({ "status" : 200, "data" : data })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Activity.findById(req.params.id)
        .populate('_contact')
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
    Activity.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return res.status(501).json({ "status": 501, "message": err.message, "error" : JSON.stringify(err) })
        }
        return res.status(204).json({ "status" : 204 , "message" : "Successfully Deleted"})
    })
})

module.exports = router
