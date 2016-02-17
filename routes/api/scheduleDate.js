var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    path = require("path")

var ScheduleDate = require("../../models/scheduleDate")
var URL_BASE = "/admin/scheduleDates"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
  var data = new ScheduleDate({
    _address: mongoose.Types.ObjectId(req.body._address),
    scheduleDay: req.body.scheduleDay,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  })
  data.save(function(err, data) {
      if (err) {
        res.status(501).json({ "status" : "error", "error" : err })
      } else {
        res.status(201).json({ "status" : "success", data })
      }
  })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
  ScheduleDate.findById(req.params.id)
    .populate('_address')
    .exec(function(err, data) {
      if (err) {
        res.status(404).json({ "status" : "error", "error" : err })
      } else {
        res.status(200).json({ "status" : "success", data })
      }
  })
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
  ScheduleDate.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
      if (err) {
        res.status(501).json({ "status" : "error", "error" : err })
      } else {
        res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
      }
  })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  ScheduleDate.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(501).json({ "status" : "error", "error" : err })
      } else {
        res.status(204).json({ "status" : "success" })
      }
  })
})

module.exports = router
