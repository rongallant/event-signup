var express = require('express')
var router = express.Router()

var Person = require("../../models/person")

var URL_BASE = "/admin/persons"

/* GET Returns all item. */
router.get('/', function(req, res, next) {
  Person.find(function(err, data) {
    if (err) {
      res.status(404).json({ error: err.message })
    } else {
      res.json(data)
    }
  })
})

/* POST New item created. */
router.post('/', function(req, res, next) {
  var data = new Person({
    nickName: req.body.nickName,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    _address: req.body.address,
    phone: req.body.phone,
    isChild: req.body.isChild,
    childAge: req.body.childAge,
    gearList: req.body.gearList,
    _emergencyContact: req.body.emergencyContact
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
  Person.findById(req.params.id, function(err, data) {
    if (err) {
      res.status(404).json({ error: err.message })
    } else {
      res.json(data)
    }
  })
})

/* PUT Updates an item. */
router.put('/:id', function(req, res, next) {
  Person.findById(req.params.id).update({$set:req.body}, function (err, data) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.redirect(URL_BASE + '/success/updated/' + req.params.id)
      }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  Person.findOneAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.redirect(URL_BASE + '/success/deleted')
      }
  })
})

module.exports = router
