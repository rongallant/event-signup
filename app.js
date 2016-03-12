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
var publicApiPaths = ["/public_api*"]
var sitePaths = ["/admin*", "/guest*", "/events*"]

// SITE Authorization
app.use(sitePaths, function(req, res, next) {
    console.log('SITE Authorization')
    authorization.pageIsAuthenticated(req, res, next)
})

// Set auth header
app.use(function(req, res, next) {
    console.log("\nSet auth header")
    console.log('req.session = ' + JSON.stringify(req.session))
    if (!isNull(req.session) && !isNull(req.session.authToken)) {
        res.locals.authToken = req.session.authToken
        res.setHeader("x-access-token", req.session.authToken)
        console.log('res.locals.authToken = ' + res.locals.authToken)
    }
    console.log('next')
    return next()
})

// API Authorization
app.use(apiPaths, function(req, res, next) {
    try {
        console.log('API Authorization')
        console.log('x-access-token = ' + req.headers['x-access-token'])
        console.log('req.body.token = ' + req.body.token)
        console.log('req.query.token = ' + req.query.token)

        var token = req.body.token || req.query.token || req.headers['x-access-token']
        if (token) {
            res.setHeader("x-access-token", token)
            console.log('Verify Token')
            jwt.verify(token, req.app.get('authToken'), function(err, decoded) {
                if (err) {
                    console.info("401 : Failed to authenticate token.  " + req.originalUrl)
                    console.error(err)
                    res.status(401).json({ "status": 401, "message": "Failed to authenticate token.", "error" : JSON.stringify(err) })
                } else {
                    req.decoded = decoded
                    console.info("200 : Authorized to access " + req.originalUrl)
                    console.log('decoded =  ' + decoded)
                    return next()
                }
            })
        } else {
            console.error('403: No token provided.')
            res.status(403).json({ "status": "403", "message": "No token provided." })
        }
    } catch(err) {
        console.error('Error authenticating API')
        err = new Error('Error authenticating API')
        err.statusCode = 401
        return next(err)
    }
})

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

if (app.get('env') === 'development') {
    // ALL - Non Errors
    app.use(function (req, res, next) {
        console.log('\nNON ERRORS')
        console.log('req.originalUrl = ' + req.originalUrl)
        console.log('req.session.authToken = ' + req.session.authToken)
        console.log('res.statusCode = ' + res.statusCode)
        console.log('res.statusMessage = ' + res.statusMessage)
        console.log('res.headersSent: ' + res.headersSent)
        console.log('x-access-token = ' + req.headers['x-access-token'])
        console.log('Ajax Request: ' + req.xhr)
        console.log('\n')
        next()
    })
    // ALL - Errors
    app.use(function (err, req, res, next) {
        console.log('\nERRORS')
        console.error(err)
        console.log('req.originalUrl = ' + req.originalUrl)
        console.log('x-access-token = ' + req.headers['x-access-token'])
        console.log('res.statusCode = ' + res.statusCode)
        console.log('res.statusMessage = ' + res.statusMessage)
        console.log('res.headersSent: ' + res.headersSent)
        console.log('Ajax Request: ' + req.xhr)
        console.log('\n')
        next(err)
    })
}

app.use(apiPaths, function (err, req, res, next)
{
    console.log('API Error Handler')
    console.log(err)
    if (err && err.statusCode && err.message) {
        res.status(err.statusCode).json({ "status": err.statusCode, "message" : err.message })
    } else {
        res.status(500).json({ "status": 500, "message" : "System Error" })
    }
})

app.use(sitePaths, function (err, req, res, next)
{
    console.error('SITE Error Handler')
    // SITE - Not Authorized
    if (err.statusCode == 401) {
        console.error('Not Authorized : ' + err.message)
        console.log('res.originalUrl = ' + res.originalUrl)
        err = new Error('Not Authorized')
        err.statusCode = 401
        req.flash('warning', "You have been logged out")
        return res.redirect('/account/login')
    }

    // SITE - 4xx Client Errors
    if (res.statusCode >= 400 && res.statusCode < 500) {
        // res.statusCode = err.statusCode || 400
        return res.render('error', {
            title: res.statusCode + ' : Error',
            message: res.statusCode + ' : Error',
            error: res.statusMessage
        })
    }

    // SITE - 5xx Server Errors
    if (res.statusCode >= 500) {
        res.statusCode = err.status || 500
        return res.render('error', {
            title: res.statusCode + ' : Error',
            message: res.statusCode + ' : Error',
            error:  res.statusMessage
        })
    }

    // SITE - Ensure error reported
    res.statusCode = 500
    res.render('error', {
        title: '500 : System Error',
        message: '500 : System Error',
        error: err.message
    })
})

module.exports = app
