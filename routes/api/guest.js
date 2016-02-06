var express = require('express')
var router = express.Router()

/* GET Returns all guest. */
router.get('/guest', function(req, res, next) {
  res.send('guest')
})

/* POST New guest created. */
router.post('/guest', function(req, res, next) {
  res.send('guest')
})

/* GET Returns single guest. */
router.get('/guest:id', function(req, res, next) {
  res.send('guest:id')
})

/* PUT Updates and guest. */
router.put('/guest:id', function(req, res, next) {
  res.send('guest:id')
})

/* DELETE Deletes an guest. */
router.delete('/guest:id', function(req, res, next) {
  res.send('guest:id')
})

module.exports = router
