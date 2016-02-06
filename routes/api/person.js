var express = require('express')
var router = express.Router()

/* GET Returns all entries. */
router.get('/person', function(req, res, next) {
  res.send('person')
})

/* POST New person created. */
router.post('/person', function(req, res, next) {
  res.send('person')
})

/* GET Returns single person. */
router.get('/person:id', function(req, res, next) {
  res.send('person:id')
})

/* PUT Updates and person. */
router.put('/person:id', function(req, res, next) {
  res.send('person:id')
})

/* DELETE Deletes an person. */
router.delete('/person:id', function(req, res, next) {
  res.send('person:id')
})

module.exports = router
