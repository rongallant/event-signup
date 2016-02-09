var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose')

var Address = require("../../models/address")

var URL_BASE = "/admin/addresses"

/* GET Returns all item. */
router.get('/', function(req, res, next) {
  Address.find()
    .populate('_mainPerson')
    .exec(function(err, data) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.json(data)
      }
  })
})

/* POST New item created. */
router.post('/', function(req, res, next) {
  var data = new Address({
    _mainPerson: mongoose.Types.ObjectId(req.body._mainPerson),
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    postalCode: req.body.postalCode,
    location: req.body.location
  })
  data.save(function(err) {
      if (err) {
        res.status(500).json({ error: err })
      } else {
        res.redirect(URL_BASE + '/success/created/' + data._id)
      }
  })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
  Address.findById(req.params.id)
    .populate('_mainPerson')
    .exec(function(err, data) {
      if (err) {
        res.status(404).json({ error: err.message })
      } else {
        res.json(data)
      }
  })
})

/* PUT Updates an item. */
router.put('/:id', function(req, res, next) {
  Address.findById(req.params.id).update({$set:req.body}, function (err, data) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.redirect(URL_BASE + '/success/updated/' + req.params.id)
      }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  Address.findOneAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(200)
        // res.redirect(URL_BASE + '/success/deleted')
      }
  })
})

module.exports = router
