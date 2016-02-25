var express = require('express'),
    router = express.Router()

router.get('/', function(req, res, next) {
    console.log('Guests Home')
    res.render("front/guests/home"  , {
        title: "Welcome",
        user: req.user,
    })
})

router.get('/about', function(req, res, next) {
    res.render("front/guests/about", {
        title: "About",
        user: req.user,
    })
})

module.exports = router
