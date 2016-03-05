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
        _address: mongoose.Types.ObjectId(req.body._address),
        _emergencyContact: mongoose.Types.ObjectId(req.body._emergencyContact),
        _pet: mongoose.Types.ObjectId(req.body._pet)
    })
    data.save(function(err, data) {
        if (err) {
            res.status(500).json({ "status" : "error", err })
        } else {
            res.status(201).json({ "status" : "success", data })
        }
    })
})

/* EDIT Returns single item. */
router.get('/:id', function(req, res, next) {
    Person.findById(req.params.id)
        .populate('_address')
        .populate('_emergencyContact')
        .exec(function(err, data) {
        if (err) {
            console.error(err)
            res.status(400).json({ "error" : err.message })
        } else {
            res.status(200).json({ "status" : "success", data })
        }
    })
})

/* by username Returns single person. */
router.get('/username/:username', function(req, res, next) {
    Person.findOne({ 'username' : req.params.username })
        // .populate('_address')
        // .populate('_emergencyContact')
        .exec(function(err, data) {
        if (err) {
            console.error(err)
            res.status(400).json({ "error" : err.message })
        } else {
            res.status(200).json({ "status" : "success", data })
        }
    })
})

/* UPDATE Updates an item. */
router.put('/', function(req, res, next) {
    Person.findByIdAndUpdate(req.body.id, { $set:req.body, upsert: true }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(500).json({ "error" : err.message })
        } else {
            res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
        }
    }
  )
})

/* UPDATE Token */
router.put('/token', function(req, res, next) {
    Person.findByIdAndUpdate(req.body.id, { token:req.body.token, upsert: true }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(500).json({ "error" : err.message })
        } else {
            res.status(201).json({ "status" : "success", "message" : "Token updated" })
        }
    }
  )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Person.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(500).json({ "error" : err.message })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
