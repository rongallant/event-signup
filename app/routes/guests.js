var express = require('express'),
    router = express.Router()

router.get('/', function(req, res, next) {
    console.log('Guests Home')
    res.render("front/guests/home"  , {
        title: "Welcome",
        user: req.user,
    })
})

module.exports = router
