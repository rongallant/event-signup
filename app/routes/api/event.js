var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    moment = require('moment')

var Event = require("../../models/event")

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
    new Event({
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        endDate: req.body.endDate,
        endTime: req.body.endTime,
        address: mongoose.Types.ObjectId(req.body.address),
        _contact: mongoose.Types.ObjectId(req.body._contact)
    }).save(function(err, data) {
        if (err) {
            return res.status(500).json({ "status" : 500, "message" : err.message, "error" : err })
        }
        return res.status(201).json({ "status" : 201, data })
    })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Event.findById(req.params.id)
        .populate('_contact address')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : 404, "message" : err.message, "error" : err })
            }
            return res.status(200).json({ "status" : 200, data })
        }
    )
})

/* GET Latest Event. */
router.get('/current', function(req, res, next) {
    Event.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : 404, "message" : err.message, "error" : err })
            }
            return res.status(200).json({ "status" : 200, data })
        }
    )
})

function dateTimeToDate(strDate, strTime) {
    return moment(strDate + ' ' + strTime, global.viewPatternDate + ' '+ global.viewPatternTime).format()
}

// set dateTime
router.put('/', function(req, res, next) {
     req.body.startDateTime = dateTimeToDate(req.body.startDate, req.body.startTime)
     req.body.endDateTime = dateTimeToDate(req.body.endDate, req.body.endTime)
     next()
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Event.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            return res.status(500).json({ "status" : 500, "message" : err.message, "error" : err })
        }
        return res.status(201).json({ "status" : 201, "data" : {"id" : req.body.id} })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ "status" : 500, "message" : err.message, "error" : err })
        }
        return res.status(204).json({ "status" : 204 })
    })
})

module.exports = router
