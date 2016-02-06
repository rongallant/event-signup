var express = require('express')
var router = express.Router()

/* GET Returns all task. */
router.get('/task', function(req, res, next) {
  res.send('task')
})

/* POST New task created. */
router.post('/task', function(req, res, next) {
  res.send('task')
})

/* GET Returns single task. */
router.get('/task:id', function(req, res, next) {
  res.send('task:id')
})

/* PUT Updates and task. */
router.put('/task:id', function(req, res, next) {
  res.send('task:id')
})

/* DELETE Deletes an task. */
router.delete('/task:id', function(req, res, next) {
  res.send('task:id')
})

module.exports = router
