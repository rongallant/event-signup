var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose')

var Event = require("../../models/event")

var URL_BASE = "/admin/events"

/* LIST Returns all item. */
router.get('/', function(req, res, next) {
  Event.find(function(err, data) {
    if (err) {
        res.json({ error: err })
    } else {
      res.json(data)
    }
  })
})

/* CREATE New item created. */
router.post('/', function(req, res, next) {
  var data = new Event({
    _address: { type: mongoose.Types.ObjectId, ref: 'Address' },
    _contact: { type: mongoose.Types.ObjectId, ref: 'Person' },
      name: req.body.name,
      description: req.body.description
  })

    // schedules: [{
    //     type: Schema.Types.ObjectId, ref: 'ScheduleDate'
    // }],
  data.save(function(err) {
      if (err) {
        res.json({ error: err })
      } else {
        res.redirect(URL_BASE + '/success/created/' + data._id)
      }
  })
})

/* EDIT Returns single item. */
router.get('/:id', function(req, res, next) {
  Event.findById(req.params.id, function(err, data) {
    if (err) {
        res.json({ error: err })
    } else {
      res.json(data)
    }
  })
})

/* UPDATE Updates an item. */
router.put('/:id', function(req, res, next) {
  Event.findById(req.params.id).update({$set:req.body}, function (err, data) {
      if (err) {
        res.json({ error: err })
      } else {
        res.redirect(URL_BASE + '/success/updated/' + req.params.id)
      }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  Event.findOneAndRemove(req.params.id, function (err) {
      if (err) {
        res.json({ error: err })
      } else {
        res.redirect(URL_BASE + '/success/deleted')
      }
  })
})

module.exports = router
