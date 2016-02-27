var express = require('express')
var router = express.Router()

router.get('/signup', function(req, res, next) {
    res.render("front/events/signup", {
        title: "Event Signup",
        user: req.user,
    })
})

module.exports = router
