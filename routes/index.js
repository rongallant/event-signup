var express = require('express')
var router = express.Router()

// Domain Root
router.get('/', function(req, res, next) {
    res.redirect('/admin')
})

module.exports = router
