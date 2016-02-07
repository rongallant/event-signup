var express = require('express')
var router = express.Router()

var Event = require("../../models/event")

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
  console.log(req.body)
  var data = new Event({
      name: req.body.name,
      description: req.body.description
  })
  data.save(function(err, data) {
      if (!err) {
        res.status(204).json({ data })
      } else {
        res.status(404).json({ error: err.message })
      }
  })
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
  Event.findById(req.params.id, function(err, data) {
    if (!err) {
      res.json(data)
    } else {
        res.status(404).json({ error: err.message })
    }
  })
})

/* PUT Updates an item. */
router.put('/:id', function(req, res, next) {
  Event.findById(req.params.id).update({$set:req.body}, function (err, data) {
      if (!err) {
        req.flash('code', 200)
        res.redirect('back')
      } else {
        res.status(500).json({ error: err.message })
      }
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  console.log(req.body)
  res.send('DELETE Deletes an item.')
})

module.exports = router
