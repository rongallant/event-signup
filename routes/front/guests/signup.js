var express = require('express'),
    router = express.Router()

router.get('/', function(req, res, next) {
    console.log('Signup')
    res.render("front/guests/signup/form"  , {
        title: "Signup",
        user: req.user,
    })
})

module.exports = router
