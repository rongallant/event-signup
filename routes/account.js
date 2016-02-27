var express = require('express')
var passport = require('passport')
var router = express.Router()

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function(req, res, next) {
    res.render("front/guests/home", {
        title: "Home",
        user: req.user
    })
})

router.get('/login', function(req, res, next) {
    res.render("front/account/login", {
        title: "Login",
        user: req.user
    })
})

router.get('/signup', function(req, res, next) {
    res.render("front/account/signup", {
        title: "Signup",
        user: req.user
    })
})

router.get('/complete', function(req, res, next) {
    res.render("front/account/createAccount", {
        title: "Create Account",
        user: req.user,
    })
})

router.get('/profile', function(req, res, next) {
    res.render("front/account/profile", {
        title: "Account Profile",
        user: req.user,
    })
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
