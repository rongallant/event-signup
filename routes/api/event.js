var express = require('express')
var router = express.Router()

/* GET Returns all event. */
router.get('/event', function(req, res, next) {
  res.send('event')
})

/* POST New event created. */
router.post('/event', function(req, res, next) {
  res.send('event')
})

/* GET Returns single event. */
router.get('/event:id', function(req, res, next) {
  res.send('event:id')
})

/* PUT Updates and event. */
router.put('/event:id', function(req, res, next) {
  res.send('event:id')
})

/* DELETE Deletes an event. */
router.delete('/event:id', function(req, res, next) {
  res.send('event:id')
})

module.exports = router
