var express = require('express'),
    router = express.Router()

router.get('/', function(req, res, next) {
    console.log('Welcome')
    res.render("front/welcome"  , {
        title: "Welcome",
        user: req.user,
    })
})

module.exports = router
