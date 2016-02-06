var express = require('express')
var router = express.Router()

/* GET Returns all vendor. */
router.get('/vendor', function(req, res, next) {
  res.send('vendor')
})

/* POST New vendor created. */
router.post('/vendor', function(req, res, next) {
  res.send('vendor')
})

/* GET Returns single vendor. */
router.get('/vendor:id', function(req, res, next) {
  res.send('vendor:id')
})

/* PUT Updates and vendor. */
router.put('/vendor:id', function(req, res, next) {
  res.send('vendor:id')
})

/* DELETE Deletes an vendor. */
router.delete('/vendor:id', function(req, res, next) {
  res.send('vendor:id')
})

module.exports = router
