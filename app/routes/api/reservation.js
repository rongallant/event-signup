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
    var fullName = req.body.emergencyContact.fullName.split(' '),
        firstName = fullName[0],
        lastName = fullName[fullName.length - 1]
    req.emergencyContact = new Person({
        username: req.body.emergencyContact.email,
        firstName: firstName,
        lastName: lastName,
        phone: req.body.emergencyContact.phone,
        email: req.body.emergencyContact.email
    })
    return next()
})

// Save Contact
router.post('/', function(req, res, next) {
    Person.findById(req.body._contact)
        .update({ emergencyContact: req.emergencyContact }, function(err, data) {
        if (err) {
            return next(err)
        }
        return next()
    })
})

// Save Reservation
router.post('/', function(req, res, next) {
    try {
        Reservation({
            _contact: mongoose.Types.ObjectId(req.body._contact),
            _event: mongoose.Types.ObjectId(req.body._event),
            teamName: req.teamName,
            arrivingDate: req.body.arrivingDate,
            additionalInformation: req.body.additionalInformation,
            guests: [ mongoose.Types.ObjectId(req.body.guests) ],
            pets: [ req.body.pets ],
            tasks: [ req.body.tasks ],
            activities: [ mongoose.Types.ObjectId(req.body.activities) ],
        }).save(function(err, data) {
            if (err) {
                return res.status(500).json({ "status" : 500, "message" : err.message })
            }
            return res.status(201).json({ "status" : "success" })
        })
    } catch(err) {
        return res.status(500).json({ "status" : 500, "message" : err.message })
    }
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Reservation.findById(req.params.id)
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                console.error(err)
                return res.status(404).json({ "status" : 404, "message" : err.message })
            }
            return res.status(200).json({ "status" : 200, "data" : data })
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Reservation.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            console.error(err)
            return res.status(500).json({ "status" : 500, "message" : err.message })
        }
        res.status(201).json({ "status" : 201, "data" : {"id" : req.body.id} })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Reservation.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ "status" : 500, "message" : err.message })
        }
        return res.status(204).json({ "status" : 204, "message" : "Successfully Deleted" })
    })
})

module.exports = router
