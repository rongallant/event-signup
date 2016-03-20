var express = require('express'),
    request = require('request'),
    router = express.Router(),
    Person = require("../../models/person"),
    appSettings = require('../utils/appSettings'),
    appDesc = []

appDesc['folder'] = '/accounts'
appDesc['singularName'] = 'Account'
appDesc['pluralName'] = 'Accounts'

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
        data: new Person(),
        formMethod: 'POST',
        formAction: res.locals.apiUri.public.account,
        formComplete: res.locals.pageAccountHome
    })
})

router.get(['/login'], function(req, res, next) {
    res.render("front/account/login", {
        title: "Login",
        user: req.user,
        formMethod: 'POST',
        formAction: res.locals.apiUri.public.login,
        formComplete: res.locals.pageAccountHome
    })
})

router.get('/complete', function(req, res, next) {
    var getUserUri = res.locals.apiUri.public.account + req.user.id
    var headers = { "x-access-token":req.session.authToken }
    request({ "uri":getUserUri, "headers":headers }, function (err, data){
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
                formAction: res.locals.apiUri.public.account,
                formComplete: res.locals.pageEventSignup
            })
        } catch(err) {
            console.error(err)
            next(err)
        }
    })
})

/************************************************************
 * API Public Access
 ************************************************************/

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect(res.locals.pageAccountLogin + '?logout=1')
})

module.exports = router
