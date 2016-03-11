var express = require('express')
var router = express.Router()

var mongoose = require('mongoose'),
    Person = require("../../models/person")

var URL_BASE = "/admin/persons"

/* CREATE New item created. */
router.post('/', function(req, res, next) {
    var data = new Person({
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        phone: req.body.phone,
        isChild: req.body.isChild,
        childAge: req.body.childAge,
        gearList: req.body.gearList,
        address: req.body.address,
        emergencyContact: req.body.emergencyContact,
        pet: req.body.pet
    })
    data.save(function(err, data) {
        if (err) {
            res.status(500).json({ "status" : 500, "message" : err.message })
        } else {
            res.status(201).json({ "status" : 201, "data" : data })
        }
    })
})

/* EDIT Returns single item. */
router.get('/:id', function(req, res, next) {
    Person.findById(req.params.id)
        .populate('address emergencyContact _vendor')
        .exec(function(err, data) {
        if (err) {
            console.error(err)
            res.status(400).json({ "status" : 400, "message" : err.message })
        } else {
            res.status(200).json({ "status" : 200, "data" : data })
        }
    })
})

/* by username Returns single person. */
router.get('/username/:username', function(req, res, next) {
    Person.findOne({ 'username' : req.params.username })
        .populate('address emergencyContact _vendor')
        .exec(function(err, data) {
        if (err) {
            console.error(err)
            res.status(400).json({ "status" : 400, "message" : err.message })
        } else {
            res.status(200).json({ "status" : 200, "data" : data })
        }
    })
})

/* UPDATE Updates an item. */
router.put('/', function(req, res, next) {
    Person.findByIdAndUpdate(req.body.id, { $set:req.body, upsert: true }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(500).json({ "status" : 500, "message" : err.message })
        } else {
            res.status(201).json({ "status" : 201, "data" : {"id" : req.body.id} })
        }
    }
  )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Person.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(500).json({ "status" : 500, "message" : err.message })
        } else {
            res.status(204).json({ "status" : 204, "message" : "Successfully Deleted" })
        }
    })
})

module.exports = router
