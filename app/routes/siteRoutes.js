/************************************************************
 * Front
 ***********************************************************/

module.exports = function(app) {

    var index = require('./front/index'),
        account = require('./front/account'),
        events = require('./front/events'),
        guests = require('./front/guests'),
        apiAccountPublic = require('./public_api/account')

    app.use(function(req, res, next){

        // App URL Paths
        res.locals.fullUrl = 'https://' + req.get('host')

        res.locals.pageHome = '/' // index page
        res.locals.pageAbout = '/about'

        // res.locals.pageAccountHome = '/account'
        res.locals.pageAccountHome = '/guest'
        res.locals.pageAccountSignup = '/account/signup'
        res.locals.pageAccountComplete = '/account/complete'
        res.locals.pageAccountLogin = '/account/login'
        res.locals.pageAccountLogout = '/account/logout'

        res.locals.pageEvent = '/events'
        res.locals.pageEventSignup = '/events/signup'

        // Flash Messaging - Returns messages to users.
        res.locals.info = req.flash('info')
        res.locals.success = req.flash('success')
        res.locals.warning = req.flash('warning')
        res.locals.alert = req.flash('alert')
        res.locals.error = req.flash('error')
        next()
    })

    // Public Site Routes
    app.use('/', index)
    app.use('/account', account)
    app.use('/public_api/account', apiAccountPublic)
    app.use('/guest', guests)
    app.use('/events', events)
}