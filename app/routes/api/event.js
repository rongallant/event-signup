var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Address = require("../../models/address"),
    Event = require("../../models/event")

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    console.log("Create new event")

    var newEvent = new Event({
        name: req.body.name,
        description: req.body['description'],
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        endDate: req.body.endDate,
        endTime: req.body.endTime,
        _contact: mongoose.Types.ObjectId(req.body._contact),
        address: req.body.address
    })
   
    newEvent.save(function(err, data) {
        if (err) {
            console.error("Error saving event")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Error saving event", "error": err })
        } else {
            // data.address = req.body.address
            // data.save(function(err) {
            //      if (err) {
            //         console.error("Could not add address to event")
            //         console.error(err)
            //         return res.status(500).json({ "status": "500", "message": "Error saving event", "error": err })
            //      }
            //     console.log("Address added to event")
            //     console.log(data)
            return res.status(201).json({ "status": "201", "message": "Address added to event" })
            // })
        }
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Event.findById(req.params.id)
        .populate('_contact')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find event")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not find event", "error": err })
            } else if (!data) {
                return res.status(404).json({ "status": "500", "message": "Event not found" })
            } else {
                return res.status(200).json({ "status": "200", "data": data })
            }
        }
    )
})

/* GET Latest Event. */
router.get('/current', function(req, res, next) {
    Event.findOne({active:true})
        .populate('_contact')
        .sort('-createdAt')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find event")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not find event", "error": err })
            } else if (!data) {
                return res.status(404).json({ "status": "500", "message": "Event not found" })
            } else {
                return res.status(200).json({ "status" : 200, "data": data })
            }
        }
    )
})

function dateTimeToDate(strDate, strTime) {
    return moment(strDate + ' ' + strTime, global.viewPatternDate + ' '+ global.viewPatternTime).format()
}

/* UPDATE Event. */
router.put('/', function(req, res, next) {
    req.body.startDateTime = dateTimeToDate(req.body.startDate, req.body.startTime)
    req.body.endDateTime = dateTimeToDate(req.body.endDate, req.body.endTime)
    return next()
},
function(req, res, next) {
    console.log("update event")
    console.log(req.body)
    Event.findByIdAndUpdate(req.body.id, { $set:req.body, upsert: true }, function(err, data) {
            if (err) {
                console.error(err)
                return res.status(500).json({ "status" : "500", "message" : "Could not update event", "error" : JSON.stringify(err) })
            }
            return res.status(201).json({ "status" : "201", "message" : "Event updated", "data" : { "id" : req.body.id } })
        }
    )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ "status" : "500", "message" : "Could not delete event", "error" : JSON.stringify(err) })
        }
        return res.status(204).json({ "status" : "204", "message" : "Event deleted" })
    })
})

module.exports = router
