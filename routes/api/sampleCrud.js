var express = require('express')
var router = express.Router()

/* GET Returns all entry. */
router.get('/entry', function(req, res, next) {
  res.send('entry')
})

/* POST New entry created. */
router.post('/entry', function(req, res, next) {
  res.send('entry')
})

/* GET Returns single entry. */
router.get('/entry:id', function(req, res, next) {
  res.send('entry:id')
})

/* PUT Updates and entry. */
router.put('/entry:id', function(req, res, next) {
  res.send('entry:id')
})

/* DELETE Deletes an entry. */
router.delete('/entry:id', function(req, res, next) {
  res.send('entry:id')
})

module.exports = router
