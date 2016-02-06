var express = require('express')
var passport = require('passport')
var router = express.Router()

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function (req, res) {
    if (req.user)
        res.redirect('/index')
    else
        res.redirect('/login')
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.get('/login', function(req, res) {
    if (req.query.logout == 1) {
        res.locals.success = "You have successfully logged out"
    }
    res.render('login', {
        title : "Absinthe Reviewer"
    })
})

router.post('/login', passport.authenticate('local', {
        successRedirect: '/index',
        successFlash: "Welcome back!",
        failureRedirect: '/login',
        failureFlash: "Username or password is invalid"
    })
)

router.get('/logout', function(req, res) {
    req.logout()

    res.redirect('/login?logout=1')
})

module.exports = router
