var express = require('express')
var router = express.Router()

/* GET Returns all activity. */
router.get('/activity', function(req, res, next) {
  res.send('activity')
})

/* POST New activity created. */
router.post('/activity', function(req, res, next) {
  res.send('activity')
})

/* GET Returns single activity. */
router.get('/activity:id', function(req, res, next) {
  res.send('activity:id')
})

/* PUT Updates and activity. */
router.put('/activity:id', function(req, res, next) {
  res.send('activity:id')
})

/* DELETE Deletes an activity. */
router.delete('/activity:id', function(req, res, next) {
  res.send('activity:id')
})

module.exports = router
