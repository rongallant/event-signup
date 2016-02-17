var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Address = require("../../models/address")
var URL_BASE = "/admin/addresses"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    var data = new Address({
        _contact: mongoose.Types.ObjectId(req.body._contact),
        name: req.body.name,
        description: req.body.description,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postalCode: req.body.postalCode,
        location: req.body.location
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
    Address.findById(req.params.id)
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
    Address.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
        }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Address.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
