var express = require('express')
var router = express.Router()

// Domain Root

router.get('/', function(req, res, next) {
    console.log('Welcome')
    res.render("front/welcome", {
        title: "Welcome",
        user: req.user,
    })
})

router.get('/about', function(req, res, next) {
    res.render("front/about", {
        title: "About",
        user: req.user,
    })
})

router.get('/message/:type/:message', function(req, res, next) {
    req.flash(req.params.type, req.params.message)
    res.status(200)
    res.end()
})

module.exports = router
