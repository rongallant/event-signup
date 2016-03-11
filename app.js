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
    methodOverride = require('method-override'),
    jwt = require('jsonwebtoken')

require('console.table')

/************************************************************
 * App Config
 ***********************************************************/

function isNull(varName) {
    return typeof varName == 'undefined'
}

var app = express()
var configDB = require('./config/database.js')
var configAuth = require('./config/auth.js')
var authorization = require('./app/helpers/authorization.js')

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

// Loggers
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
app.use(cookieParser(configAuth.secret))

// Session
app.use(expressSession({
    cookie: { secure: false, maxAge: 1800000 }, // Timeout set to 30 minutes
    store: new expressSession.MemoryStore,
    saveUninitialized: true,
    resave: true,
    secret: configAuth.secret
}))

app.use(flash())

/************************************************************
 * Resource Paths
 ***********************************************************/

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

// MongooseJS / MongoDB
mongoose.connect(configDB.url)
mongoose.set('debug', true)
app.set('authToken', configDB.secret); // secret variable

/************************************************************
 * Security
 ***********************************************************/

require('./config/passport')(app, passport); // pass passport for configuration

/************************************************************
 * Routes
 ***********************************************************/

var apiPaths = ["/api*"]
// var sitePaths = ["/admin*", "/guest*", "/public_api*"]
var sitePaths = ["/admin*", "/guest*"]

// Set auth header
app.use(function(req, res, next) {
    // console.log("Set auth header")
    // console.log('req.session = ' + JSON.stringify(req.session))
    if (!isNull(req.session) && !isNull(req.session.authToken)) {
        res.locals.authToken = req.session.authToken
        res.setHeader("x-access-token", req.session.authToken)
        // console.log('res.locals.authToken = ' + res.locals.authToken)
    }
    return next()
})

// Set global headers

// // API Authorization
// app.use(apiPaths, function(req, res, next) {
//     console.log(2)
//     console.log('res.url = ' + res.url)
//     authorization.apiIsAuthenticated(req, res, next)
//     if (req.session.authToken) {
//         res.setHeader("x-access-token", req.session.authToken)
//     }
//     authorization.apiIsAuthenticated(req, res, next)
//     return next()
// })

// // SITE Authorization
// app.use(sitePaths, function(req, res, next) {
//     console.log(3)
//     console.log('res.url = ' + res.url)
//     authorization.pageIsAuthenticated(req, res, next)
//     return next()
// })

// LOAD SITE ROUTES
require('./app/routes/appUrls')(app)
require('./app/routes/apiRoutes')(app)
require('./app/routes/siteRoutes')(app)
require('./app/routes/adminRoutes')(app)

/************************************************************
 * Error Handling
 * 1xx Informational. This class of status code indicates a provisional
 *     response, consisting only of the Status-Line and optional headers, and
 *     is terminated by an empty line.
 * 2xx Success.
 * 3xx Redirection.
 * 4xx Client Error.
 * 5xx Server Error.
 ***********************************************************/

if (app.get('env') === 'STOPdevelopment') {
    // ALL - Non Errors
    app.use(function (req, res, next) {
        console.log(4)
        console.log('\nNON ERRORS')
        console.log('res.url = ' + res.url)
        console.log('res.statusCode = ' + res.statusCode)
        console.log('res.statusMessage = ' + res.statusMessage)
        console.log('res.headersSent: ' + res.headersSent)
        console.log('req.session.authToken = ' + req.session.authToken)
        console.log('x-access-token = ' + req.headers['x-access-token'])
        console.log('Ajax Request: ' + req.xhr)
        console.log('\n')
        next()
    })
    // ALL - Errors
    app.use(function (err, req, res, next) {
    console.log(5)
        if (err) {}
        console.log('\nERRORS')
        try {
            console.log('res.url = ' + res.url)
            console.log('x-access-token = ' + req.headers['x-access-token'])
            console.log('res.statusCode = ' + res.statusCode)
            console.log('res.statusMessage = ' + res.statusMessage)
            console.log('res.headersSent: ' + res.headersSent)
            console.log('Ajax Request: ' + req.xhr)
            console.log('\n')
        } catch(err) {
            console.error('Debug error...error: ' + err.message)
        }
        next(err)
    })
}

// SITE - Not Authorized
app.use(sitePaths, function (err, req, res, next) {
    console.log(6)
    console.log('res.url = ' + res.url)
    if (err.statusCode == 401) {
        console.error('Not Authorized : ' + err.message)
        err = new Error('Not Authorized')
        err.status = 401
        req.flash('warning', "You have been logged out")
        return res.redirect('/account/login')
    }
    next(err)
})

// // SITE - 5xx Server Errors
app.use(sitePaths, function (err, req, res, next) {
    console.log(8)
    if (res.statusCode >= 500) {
        res.status(err.status || 500)
        return res.render('error', {
            title: res.statusCode + ' : Error',
            message: res.statusCode + ' : Error',
            error:  res.statusMessage
        })
    }
    next(err)
})

// SITE - 4xx Client Errors
app.use(sitePaths, function(err, req, res, next) {
    console.log(9)
    console.log('res.url = ' + res.url)
    if (res.statusCode >= 400 && res.statusCode < 500) {
        // res.status(err.status || 400)
        return res.render('error', {
            title: res.statusCode + ' : Error',
            message: res.statusCode + ' : Error',
            error: res.statusMessage
        })
    }
    next(err)
})

// // SITE - Ensure error reported
// app.use(sitePaths, function (err, req, res, next) {
//     console.log(10)
//     console.log('res.url = ' + res.url)
//     if (res.headersSent) {
//         return next(err)
//     }
//     res.status(500)
//     res.render('error', {
//         title: '500 : System Error',
//         message: '500 : System Error',
//         error: err.message
//     })
// })

module.exports = app
