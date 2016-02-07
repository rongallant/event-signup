var express = require('express')
var router = express.Router()

/* GET Returns all item. */
router.get('/', function(req, res, next) {
  console.log(req.query)
  res.send('GET Returns all item.')
})

/* POST New item created. */
router.post('/', function(req, res, next) {
  console.log(req.body)
  res.send('POST New item created.')
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
  console.log(req.query)
  res.send('GET Returns single item.')
})

/* PUT Updates an item. */
router.put('/:id', function(req, res, next) {
  console.log(req.body)
  res.send('PUT Updates an item.')
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
  console.log(req.body)
  res.send('DELETE Deletes an item.')
})

module.exports = router
