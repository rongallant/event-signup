var express = require('express')
var router = express.Router()

var Event = require("../../models/event")

var URL_BASE = "/admin/events"

/* GET Returns all item. */
router.get('/', function(req, res, next) {
  console.log(req.query)
  Event.find(function(err, data) {
    if (!err) {
      res.json(data)
    }
    else {
      res.status(404).json({ error: err.message })
    }
  })
})

/* POST New item created. */
router.post('/', function(req, res, next) {
  var data = new Event({
      name: req.body.name,
      description: req.body.description
  })
  data.save(function(err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.redirect(URL_BASE + '/success/created/' + data._id)
      }
  })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
  Event.findById(req.params.id, function(err, data) {
    if (err) {
        res.status(404).json({ error: err.message })
    } else {
      res.json(data)
    }
  })
})

/* PUT Updates an item. */
router.put('/:id', function(req, res, next) {
  Event.findById(req.params.id).update({$set:req.body}, function (err, data) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        console.table(data)
        console.table(req.body)
        console.table(req.params)

        res.redirect(URL_BASE + '/success/updated/' + req.params.id)
      }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  Event.findOneAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.redirect(URL_BASE + '/success/deleted')
      }
  })
})

module.exports = router
