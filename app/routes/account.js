var express = require('express'),
    request = require('request'),
    passport = require('passport'),
    path = require("path"),
    router = express.Router(),
    Person = require("../models/person"),
    appSettings = require('./utils/appSettings')

var appDesc = []
appDesc['apiPublic'] = '/public_api/account/'
appDesc['apiSingle'] = '/person/'
appDesc['folder'] = '/accounts'
appDesc['singularName'] = 'Account'
appDesc['pluralName'] = 'Accounts'
appDesc['newObject'] = new Person()

router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function(req, res, next) {
   res.send('User Home should be guest landing')
})

router.get('/signup', function(req, res, next) {
    res.render("front/account/signup", {
        title: "Signup",
        data: appDesc['newObject'],
        formMethod: 'POST',
        formAction: res.locals.fullUrl + appDesc['apiPublic']
    })
})

router.get(['/login'], function(req, res, next) {
    res.render("front/account/login", {
        title: "Login",
        user: req.user,
        formMethod: 'POST',
        formAction: res.locals.fullUrl + path.join(appDesc['apiPublic'], 'login')
    })
})

router.get('/complete', function(req, res, next) {
    var getUserUrl = res.locals.fullUrl + path.join(appDesc['apiPublic'], req.user.id)
    request(getUserUrl, function (err, data){
        if (err) {
            console.error('REQUEST: ' + err)
            return next(err)
        }
        try {
            res.render('front/account/complete', {
                title: "Complete Account",
                user: req.user,
                data: JSON.parse(data.body).data,
                formMode: 'edit',
                formMethod: 'PUT',
                formAction: res.locals.apiItem,
                formComplete: res.locals.pageEventSignup
            })
        } catch(err) {
            console.error('RENDER: ' + err)
            next(err)
        }
    })
})

/************************************************************
 * API Public Access
 ************************************************************/

function userExist(req, res, next) {
    Person.count({
        username: req.body.username
    }, function(err, count) {
        if (err) {
            return next(err)
        }
        if (count === 0) {
            next()
        } else {
            res.redirect("/signup")
        }
    });
}

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/account/login?logout=1')
})

/************************************************************
 * ACTIONS Facebook
 ************************************************************/

router.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}))

router.get("/auth/facebook/callback",
    passport.authenticate("facebook",{ failureRedirect: '/login'}),
    function(req,res){
        res.render("loggedin", {user : req.user})
    }
)

module.exports = router
