var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    path = require("path")

var ScheduleDate = require("../../models/scheduleDate")
var URL_BASE = "/admin/scheduleDates"

/* LIST Returns all item. */
router.get('/', function(req, res, next) {
    ScheduleDate.find()
        .populate('_address')
        .exec(function(err, data) {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                res.json(data)
            }
        }
    )
})

/* CREATE New item created. */
router.post('/', function(req, res, next) {
    var data = new ScheduleDate({
        scheduleDay: req.body.scheduleDay,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        _address: mongoose.Types.ObjectId(req.body._address),
    })
    data.save(function(err) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.redirect(path.join(URL_BASE + '/success/created/' + data._id))
        }
    })
})

/* EDIT Returns single item. */
router.get('/:id', function(req, res, next) {
    ScheduleDate.findById(req.params.id)
        .populate('_address')
        .exec(function(err, data) {
            if (err) {
                res.status(404).json({ error: err })
            } else {
                res.json(data)
            }
        }
    )
})

/* UPDATE Updates an item. */
router.put('/:id', function(req, res, next) {
    ScheduleDate.findById(req.params.id)
        .update({$set:req.body}, function (err, data) {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                res.redirect(path.join(URL_BASE + '/success/updated/' + req.params.id))
            }
        }
    )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    ScheduleDate.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200)
        }
    })
})

/* SEARCH Returns all item. */
router.get('/search/:q', function(req, res, next) {
  var regex = new RegExp(req.params.q, 'i');
  ScheduleDate.find()
    .or({scheduleDay: regex})
    .or({startTime: regex})
    .or({endTime: regex})
    // .or({_address:{$elemMatch:{address1: regex}}})
    // .or({_address:{$elemMatch:{city: regex}}})
    // .or({_address:{$elemMatch:{state: regex}}})
    // .or({_address:{$elemMatch:{country: regex}}})
    // .or({_address:{$elemMatch:{postalCode: regex}}})
    // .populate('_contact')
    .exec(function(err, results) {
        if (err) {
          res.status(500).json({ error: err })
        } else {
          res.json(results);
        }
  })
})
module.exports = router
