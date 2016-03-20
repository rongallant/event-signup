var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    Event = require("../../models/event")

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    try {
        console.log('Post Event')
        console.log(req.body)

        var event = new Event({
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            endDate: req.body.endDate,
            endTime: req.body.endTime,
            address: req.body.address, // Using array because I can't get embeded docs to play nice.
            _contact: mongoose.Types.ObjectId(req.body._contact)
        })
    } catch(err) {
        console.error("Error creating event")
        console.error(err)
        return res.status(500).json({ "status" : "500", "message" : "Error creating event", "error" : JSON.stringify(err) })
    }
    event.save(function(err, data) {
        if (err) {
            return res.status(500).json({ "status" : "500", "message" : "Error saving event", "error" : JSON.stringify(err) })
        }
        return res.status(201).json({ "status" : "201", "data": data })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Event.findById(req.params.id)
        .populate('_contact address')
        .exec(function(err, data) {
            console.log('data')
            console.log(data)
            if (err) {
                return res.status(404).json({ "status" : "404", "message" : err.message, "error" : JSON.stringify(err) })
            }
            return res.status(200).json({ "status" : "200", "data": data })
        }
    )
})

/* GET Latest Event. */
router.get('/current', function(req, res, next) {
    Event.findOne({active:true})
        .populate('_contact address')
        .sort('-createdAt')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : "404", "message" : "Latest event not found", "error" : JSON.stringify(err) })
            }
            return res.status(200).json({ "status" : 200, "data": data })
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
