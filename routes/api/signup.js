var express = require('express')
var router = express.Router()

/* GET Returns all entries. */
router.get('/entries', function(req, res, next) {
  res.send('entries')
})

/* POST New entry created. */
router.post('/entries', function(req, res, next) {
  res.send('entries')
})

/* GET Returns single entry. */
router.get('/entries:id', function(req, res, next) {
  res.send('entries:id')
})

/* PUT Updates and entry. */
router.put('/entries:id', function(req, res, next) {
  res.send('entries:id')
})

/* DELETE Deletes an entry. */
router.delete('/entries:id', function(req, res, next) {
  res.send('entries:id')
})

module.exports = router
