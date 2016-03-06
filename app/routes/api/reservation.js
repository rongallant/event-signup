var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Reservation = require("../../models/reservation"),
    Person = require("../../models/person")

/************************************************************
 * REST API
 ************************************************************/

// Get contact and update  their emergency contact
router.post('/', function(req, res, next) {
    var fullName = req.body._emergencyContact.fullName.split(' '),
        firstName = fullName[0],
        lastName = fullName[fullName.length - 1]
    Person({
        username: req.body._emergencyContact.email,
        firstName: firstName,
        lastName: lastName,
        phone: req.body._emergencyContact.phone,
        email: req.body._emergencyContact.email
    }).save(function(err, data) {
        if (err) {
           console.error(err)
        }
        req.emergencyContact = data
        return next()
    })
})

// Save Contact
router.post('/', function(req, res, next) {
    Person.findById(req.body._contact)
        .update({ _emergencyContact: mongoose.Types.ObjectId(req.emergencyContact.id) }, function(err, data) {
        if (err) {
           console.error(err)
        }
        return next()
    })
})

// Save Reservation
router.post('/', function(req, res, next) {

    console.log('Reservation req.body = ' + JSON.stringify(req.body._contact))

    Reservation({
        _contact: mongoose.Types.ObjectId(req.body._contact),
        _event: mongoose.Types.ObjectId(req.body._event),
        teamName: req.teamName,
        arrivingDate: req.body.arrivingDate,
        additionalInformation: req.body.additionalInformation,
        guests: [ mongoose.Types.ObjectId(req.body.guests) ],
        pets: [ mongoose.Types.ObjectId(req.body.pets) ],
        tasks: [ mongoose.Types.ObjectId(req.body.tasks) ],
        activities: [ mongoose.Types.ObjectId(req.body.activities) ],
    }).save(function(err, data) {
        if (err) {
            console.error('501: Error saving Reservation : ' + err.message)
            res.status(501).json({ "status" : "Error Saving Reservation", "error" : err.message })
        } else {
            res.status(201).json({ "status" : "success", data })
        }
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Reservation.findById(req.params.id)
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                console.error(err)
                res.status(404).json({ "status" : "error", "error" : err.message })
            } else {
                res.status(200).json({ "status" : "success", data })
            }
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Reservation.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            console.error(err)
            res.status(501).json({ "status" : "error", "error" : err.message })
        } else {
            res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
        }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Reservation.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.error(err)
            res.status(501).json({ "status" : "error", "error" : err.message })
        } else {
            res.status(204).json({ "status" : "success" })
        }
    })
})

module.exports = router
