var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose')

var Activity = require("../../models/activity")

var URL_BASE = "/admin/activities"

/************************************************************
 * REST API
 ************************************************************/

/* POST New item created. */
router.post('/', function(req, res, next) {
  var data = new Activity({
    _contact: mongoose.Types.ObjectId(req.body._contact),
    name: req.body.name,
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  })
  data.save(function(err, data) {
      if (err) {
        res.status(500).json({ error: err })
      } else {
        // 201 Created
        res.status(201).json({ "status" : "ok", data })
      }
  })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
  Activity.findById(req.params.id)
    .populate('_contact')
    .exec(function(err, data) {
      if (err) {
        res.status(400).json({ error: err.message })
      } else {
  console.log('The rsult are an array: ', data);
        res.status(200).json({ "status" : "ok", data })
      }
  })
})

/* PUT Updates an item. */
router.put('/:id', function(req, res, next) {
  Activity.findById(req.params.id).update({$set:req.body}, function (err, data) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(201).json({ "status" : "ok", data })
      }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  Activity.findOneAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(204).json({ "status" : "ok" })
      }
  })
})

module.exports = router
