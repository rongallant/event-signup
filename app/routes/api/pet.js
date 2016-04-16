var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

var Pet = require("../../models/pet")
var URL_BASE = "/admin/pets"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    var data = new Pet(
      {
        petName: req.body.petName,
        petWeight: req.body.petWeight,
        petType: req.body.petType,
        _contact: mongoose.Types.ObjectId(req.body._contact)
    })
    data.save(function(err, data) {
        if (err) {
            res.status(500).json({ "status": 500, "message" : err.message })
        } else {
            res.status(201).json({ "status" : 201, "data" : data })
        }
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    var populate = !req.query.simple ? '' : '_contact'
    Pet.findById(req.params.id)
        .populate(populate)
        .exec(function(err, data) {
            if (err) {
                res.status(404).json({ "status" : 404, "message" : err.message })
            } else {
                res.status(200).json({ "status" : 200, "data" : data })
            }
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Pet.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(500).json({ "status" : 500, "message" : err.message })
        } else {
            res.status(201).json({ "status" : 201, "data" : {"id" : req.body.id} })
        }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Pet.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete pet", "error": err })
        } else if (data === null) {
            return res.status(404).json({ "status": "404", "message": "Pet not found" })
        }
        return res.status(200).json({ "status": "200", "message": "Pet deleted" })
    })
})

module.exports = router
