var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Reservation = require("../../models/reservation"),
    Person = require("../../models/person")

/************************************************************
 * REST API
 ************************************************************/

function isJSON(testVar) {
    try {
        JSON.parse(testVar)
        return true
    } catch (e) {
       return false
    }
}

// Get contact and update  their emergency contact
router.post('/', function(req, res, next) {
    console.log('reservation.js - POST - Create Emergency Contact')
    try {
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
    } catch(err) {
        if (isJSON(err) && err.name === 'ValidationError') {
            return res.status(304).json(err)
        }
        return res.json({ "status" : "500", "message" : "Error creating emergency contact", "error" : err })
    }
    return next()
})

// Save Contact
router.post('/', function(req, res, next) {
    console.log('reservation.js - POST - Save Emergency Contact to user')
    Person.findById(req.body._contact)
        .update({ emergencyContact: req.emergencyContact }, function(err, data) {
        if (err) {
            console.log(JSON.parse(err))
            if (err && isJSON(err)) {
                return res.status(304).json(err)
            }
            return res.json({ "status" : "500", "message" : "Error saving emergency contact", "error" : err })
        }
        return next()
    })
})

// Save Reservation
router.post('/', function(req, res, next) {
    console.log('reservation.js - POST - Save Reservation')
    try {
        console.log(req.body.guests)
        var reservation = Reservation({
            _contact: mongoose.Types.ObjectId(req.body._contact),
            _event: mongoose.Types.ObjectId(req.body._event),
            teamName: req.teamName,
            arrivingDate: req.body.arrivingDate,
            additionalInformation: req.body.additionalInformation,
            guests: [ req.body.guests ],
            pets: [ req.body.pets ],
            tasks: [ req.body.tasks ],
            activities: [ mongoose.Types.ObjectId(req.body.activities) ],
        })
        console.log(reservation)
    } catch(err) {
        if (isJSON(err) && err.name === 'ValidationError') {
            console.error('ValidationError creating Reservation')
            return res.status(500).json(err)
        }
        console.error("Error creating reservation")
        console.error(err)
        return res.status(500).json({ "status" : err.status, "message" : "Error creating reservation", "error" : err })
    }
    reservation.save(function(err, data) {
        if (err) {
            try {
                console.log(err.message)
                console.log(err.errors)
                return res.status(500).json(err)
            } catch(err) {
                console.error("Error saving reservation")
                return res.status(500).json({ "status" : "500", "message" : "Error saving reservation", "error" : err })
            }
        }
        return res.status(201).json({ "status" : "201", "message" : "Reservation Successfully Saved" })
    })
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
            return res.status(500).json({ "status" : 500, "message" : "Error deleting reservation", "error": err  })
        }
        return res.status(204).json({ "status" : 204, "message" : "Successfully Deleted" })
    })
})

module.exports = router
