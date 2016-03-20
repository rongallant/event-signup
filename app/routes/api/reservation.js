var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Account = require("../../models/account"),
    EmergencyContact = require("../../models/emergencyContact"),
    Person = require("../../models/person"),
    Reservation = require("../../models/reservation")


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

// function getPersonId(req, res, next) {
//     Account.findOne({ "username" : req.user.username },  "_person", function(err, data){
//         if (err) {
//             console.error(err)
//             return next(err)
//         }
//         req.personId = data._person._id
//         console.log('_person' + req.body._contact)
//         console.log('data._person' + data._person)
//         console.log('data._person._id' + data._person._id)
//         return next()
//     })
// }

// Save Contact
function insertContactsEmergencyContact(req, res, next) {
    console.log('POST - reservation.js - Save Emergency Contact to user')
     var fullName = req.body.emergencyContact.fullName.split(' '),
            firstName = fullName[0],
            lastName = fullName[fullName.length - 1]
    var newEmergencyContact = {
        username: req.body.emergencyContact.email,
        firstName: firstName,
        lastName: lastName,
        phone: req.body.emergencyContact.phone,
        email: req.body.emergencyContact.email
    }
    Person.update({ _id: req.body._contact }, { $set: { emergencyContact: newEmergencyContact } }, function(err, data) {
        if (err) {
            console.error("Error saving emergency contact")
            console.error(err)
            return res.json({ "status": "500", "message": "Could not save emergency contact", "error": JSON.stringify(err) })
        } else if (data.ok === 0) {  
            console.error("Did not save emergency contact " + data)
            return next()
        }
        console.log("Emergency contact saved")
        console.log(data)
        return next()
    })
}

function createReservation(req, res, next) {
    console.log('POST - reservation.js - Create Reservation')
    try {
        var reservation = Reservation({
            _contact: mongoose.Types.ObjectId(req.body._contact),
            _event: mongoose.Types.ObjectId(req.body._event),
            teamName: req.teamName,
            arrivingDate: req.body.arrivingDate,
            additionalInformation: req.body.additionalInformation,
            guests: req.body.guests,
            pets: req.body.pets
        })
        req.newReservation = reservation
        return next()
    } catch(err) {
        console.error("Error creating reservation")
        console.error(err)
        return res.status(500).json({ "status": "500", "message": "Error creating reservation", "error": JSON.stringify(err) })
    }
}

// Save Reservation
router.post('/', insertContactsEmergencyContact, createReservation, function(req, res, next) {
    // console.log('POST - reservation.js - Save Reservation')
    req.newReservation.save(function(err, data) {
        if (err) {
            console.error("Error saving reservation")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Error saving reservation", "error": JSON.stringify(err) })
        }
        console.log("Reservation Successfully Saved")
        return res.status(201).json({ "status": "201", "message": "Reservation Successfully Saved" })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Reservation.findById(req.params.id)
        .populate('_event _contact guests pets activities tasks')
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
            return res.status(500).json({ "status": "500", "message": "Error deleting reservation", "error": err  })
        }
        return res.status(204).json({ "status" : "204", "message" : "Successfully Deleted" })
    })
})

module.exports = router
