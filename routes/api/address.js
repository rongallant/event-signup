var express = require('express')
var router = express.Router()

/* GET Returns all address. */
router.get('/address', function(req, res, next) {
  res.send('address')
})

/* POST New address created. */
router.post('/address', function(req, res, next) {
  res.send('address')
})

/* GET Returns single address. */
router.get('/address:id', function(req, res, next) {
  res.send('address:id')
})

/* PUT Updates and address. */
router.put('/address:id', function(req, res, next) {
  res.send('address:id')
})

/* DELETE Deletes an address. */
router.delete('/address:id', function(req, res, next) {
  res.send('address:id')
})

module.exports = router
