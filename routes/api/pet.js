var express = require('express')
var router = express.Router()

/* GET Returns all pet. */
router.get('/pet', function(req, res, next) {
  res.send('pet')
})

/* POST New pet created. */
router.post('/pet', function(req, res, next) {
  res.send('pet')
})

/* GET Returns single pet. */
router.get('/pet:id', function(req, res, next) {
  res.send('pet:id')
})

/* PUT Updates and pet. */
router.put('/pet:id', function(req, res, next) {
  res.send('pet:id')
})

/* DELETE Deletes an pet. */
router.delete('/pet:id', function(req, res, next) {
  res.send('pet:id')
})

module.exports = router
