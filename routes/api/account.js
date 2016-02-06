var express = require('express')
var router = express.Router()

/* GET Returns all entries. */
router.get('/account', function(req, res, next) {
  res.send('account')
})

/* POST New account created. */
router.post('/account', function(req, res, next) {
  res.send('account')
})

/* GET Returns single account. */
router.get('/account:id', function(req, res, next) {
  res.send('account:id')
})

/* PUT Updates and account. */
router.put('/account:id', function(req, res, next) {
  res.send('account:id')
})

/* DELETE Deletes an account. */
router.delete('/account:id', function(req, res, next) {
  res.send('account:id')
})

module.exports = router
