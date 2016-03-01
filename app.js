/************************************************************
 * Dependencies
 ***********************************************************/

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    consoletable = require('console.table'),
    methodOverride = require('method-override')

/************************************************************
 * App Config
 ***********************************************************/

var app = express()

// Global variables
app.locals.apptitle = 'HANGCON'
app.locals.url = 'hangcon.com'
app.locals.email = 'ron@rongallant.com'
app.locals.resultsPerPage = 10

global.viewPatternDate = "D MMMM, YYYY"
global.viewPatternTime = "h:mm A"

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('view options', { layout: false })
app.use(logger('dev'))

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true})) // to support URL-encoded bodies
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(cookieParser('This is a crazy secret, Shjahsk'))

// Session
app.use(expressSession({
    cookie: { secure: false, maxAge: 1800000 }, // Timeout set to 30 minutes
    store: new expressSession.MemoryStore,
    saveUninitialized: true,
    resave: true,
    secret: 'This is a crazy secret, Shjahsk'
}))

// Route that creates a flash message using the express-flash module
app.all('/express-flash', function( req, res ) {
    req.flash('success', 'This is a flash message using the express-flash module.')
    res.redirect(301, '/')
})
app.use(flash())

/************************************************************
 * Resource Paths
 ***********************************************************/

// app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/themes', express.static(path.join(__dirname, 'node_modules', 'semantic-ui-less', 'themes')))
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'semantic-ui-daterangepicker')))
app.use('/javascripts', express.static(path.join(__dirname, 'semantic', 'dist')))
app.use('/pickadate', express.static(path.join(__dirname, 'node_modules', 'pickadate', 'lib', 'compressed')))
app.use('/moment', express.static(path.join(__dirname, 'node_modules', 'moment', 'min')))

/************************************************************
 * Database
 ***********************************************************/

var configDB = require('./config/database.js')

// MongooseJS / MongoDB
mongoose.connect(configDB.url)
mongoose.set('debug', true)

/************************************************************
 * Security
 ***********************************************************/

require('./config/passport')(app, passport); // pass passport for configuration

app.all(["/admin*", "/guest*"], function(req, res, next) {
    console.log('admin passed')
    if (req.isAuthenticated()) {
        console.info('Checking auth: PASS')
        next()
    } else {
        console.info('Checking auth: FAIL')
        var err = new Error('Not Authorized')
        err.status = 401
        next(err)
    }
})
app.all("/api*", function(req, res, next) {


    console.log('req.session.passport.user')
    console.log(req.session.passport.user)
    console.log('req.user')
    console.log(req.user)
    console.log('req.isAuthenticated() = ' + req.isAuthenticated())

    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({
            "status": "error",
            "error": "Not Authorized"
        })
    }
})

/************************************************************
 * Routes
 ***********************************************************/

require('./app/routes.js')(app, passport) // load our routes and pass in our app and fully configured passport

/************************************************************
 * Error Handling
 ***********************************************************/

// catch 401 and forward to error handler
app.use(function(err, req, res, next) {
    var err = new Error('Not Authorized')
    err.status = 401
    res.redirect('/account/login')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Page Not Found')
    err.status = 404
    next(err)
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app
