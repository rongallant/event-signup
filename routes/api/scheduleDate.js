var express = require('express')
var router = express.Router()

/* GET Returns all scheduleDate. */
router.get('/scheduleDate', function(req, res, next) {
  res.send('scheduleDate')
})

/* POST New scheduleDate created. */
router.post('/scheduleDate', function(req, res, next) {
  res.send('scheduleDate')
})

/* GET Returns single scheduleDate. */
router.get('/scheduleDate:id', function(req, res, next) {
  res.send('scheduleDate:id')
})

/* PUT Updates and scheduleDate. */
router.put('/scheduleDate:id', function(req, res, next) {
  res.send('scheduleDate:id')
})

/* DELETE Deletes an scheduleDate. */
router.delete('/scheduleDate:id', function(req, res, next) {
  res.send('scheduleDate:id')
})

module.exports = router
