var express = require('express')
var router = express.Router()

/* GET Returns all meal. */
router.get('/meal', function(req, res, next) {
  res.send('meal')
})

/* POST New meal created. */
router.post('/meal', function(req, res, next) {
  res.send('meal')
})

/* GET Returns single meal. */
router.get('/meal:id', function(req, res, next) {
  res.send('meal:id')
})

/* PUT Updates and meal. */
router.put('/meal:id', function(req, res, next) {
  res.send('meal:id')
})

/* DELETE Deletes an meal. */
router.delete('/meal:id', function(req, res, next) {
  res.send('meal:id')
})

module.exports = router
