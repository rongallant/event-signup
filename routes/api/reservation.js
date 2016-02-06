var express = require('express')
var router = express.Router()

/* GET Returns all reservation. */
router.get('/reservation', function(req, res, next) {
  res.send('reservation')
})

/* POST New reservation created. */
router.post('/reservation', function(req, res, next) {
  res.send('reservation')
})

/* GET Returns single reservation. */
router.get('/reservation:id', function(req, res, next) {
  res.send('reservation:id')
})

/* PUT Updates and reservation. */
router.put('/reservation:id', function(req, res, next) {
  res.send('reservation:id')
})

/* DELETE Deletes an reservation. */
router.delete('/reservation:id', function(req, res, next) {
  res.send('reservation:id')
})

module.exports = router
