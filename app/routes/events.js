var express = require('express')
var router = express.Router()

router.get('/signup', isAuthenticated, function(req, res, next) {
    res.render("front/events/signup", {
        title: "Event Signup",
        user: req.user,
    })
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
      var err = new Error('Not Authorized')
      err.status = 401
      next(err)
    }
}

module.exports = router
