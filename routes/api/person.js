var express = require('express')
var router = express.Router()

var mongoose = require('mongoose'),
    Person = require("../../models/person")

var URL_BASE = "/admin/persons"

/* CREATE New item created. */
router.post('/', function(req, res, next) {
    var data = new Person({
        nickName: req.body.nickName,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        phone: req.body.phone,
        isChild: req.body.isChild,
        childAge: req.body.childAge,
        gearList: req.body.gearList,
        _address: mongoose.Types.ObjectId(req.body._address),
        _emergencyContact: mongoose.Types.ObjectId(req.body._emergencyContact)
    })
    data.save(function(err) {
        if (err) {
            res.status(500).json({ error: err })
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
            res.status(400).json({ error: err.message })
        } else {
            res.status(200).json({ "status" : "success", data })
        }
    })
})

/* UPDATE Updates an item. */
router.put('/', function(req, res, next) {
    Person.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.status(201).json({ "status" : "success", "itemId": req.body.id })
        }
  })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Person.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
