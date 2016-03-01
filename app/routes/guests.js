var express = require('express'),
    router = express.Router()

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
      var err = new Error('Not Authorized')
      err.status = 401
      next(err)
    }
}

router.get('/', isAuthenticated, function(req, res, next) {
    console.log('Guests Home')
    res.render("front/guests/home"  , {
        title: "Welcome",
        user: req.user,
    })
})

module.exports = router
