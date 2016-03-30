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
    request = require('request'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    jwt = require('jsonwebtoken')

/************************************************************
 * App Config
 ***********************************************************/

function isNull(varName) {
    return varName == 'undefined' || !varName
}

function notNull(varName) {
    return varName != 'undefined' && varName
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

require('./app/routes/appUrls')(app)
require('./config/passport')(app, passport); // pass passport for configuration

var apiPaths = ["/api*"]
// var publicApiPaths = ["/public_api*"]
var sitePaths = ["/admin*", "/guest*", "/events*", "/accounts*"]
var adminPaths = ["/admin*"]

// ADMIN Authorization
app.use(adminPaths, function(req, res, next) {
    console.log("ADMIN Authorization")
    if (req.isAuthenticated() && authorization.isAdmin(req.user.roles)) {
        console.log("200 : Authorized to access admin area " + req.path)
        return next()
    }
    console.error("401 : Not Authorized to access admin area " + req.path)
    var err = new Error('Not Authorized to access admin area ' + req.path)
    err.statusCode = 401
    return next(err)
})

// SITE Authorization
app.use(sitePaths, function(req, res, next) {
    console.log("SITE Authorization")
    if (req.isAuthenticated() && authorization.isUser(req.user.roles)) {
        var getUserUri = res.locals.apiUri.public.hasprofile  + req.user.username
        var headers = { "x-access-token":req.session.authToken }
        request({ "uri": getUserUri, "headers":headers }, function (err, data){
            if (err) {
                console.log('Error checking for profile')
                console.error(err)
            } else if (!JSON.parse(data.body)._person) {
                console.log("No person found associated with account.")
                return res.redirect(res.locals.pageAccountComplete)
            } else {
                console.info("200 : Authorized to access " + req.path)
                return next()
            }
        })
    } else {
        console.info("401 : Not Authorized to access " + req.path)
        var err = new Error('Not Authorized to access ' + req.path)
        err.statusCode = 401
        return next(err)
    }
})

// Set auth header
app.use(function(req, res, next) {
    // console.log("Set auth header")
    if (isNull(res.getHeader("x-access-token")) && !isNull(req.session) && !isNull(req.session.authToken)) {
        res.locals.authToken = req.session.authToken
        res.setHeader("x-access-token", req.session.authToken)
    }
    return next()
})

// API Authorization
app.use(apiPaths, function(req, res, next) {
    // console.log("API Authorization")
    // Debug
    // if (notNull(req.headers['x-access-token']))  console.log('x-access-token = ' + req.headers['x-access-token'])
    // if (notNull(req.body.token))  console.log('req.body.token = ' + req.body.token)
    // if (notNull(req.query.token))  console.log('req.query.token = ' + req.query.token)
    // if (notNull(res.locals.authToken))  console.log('res.locals.authToken = ' + res.locals.authToken)
    // Auth
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || res.locals.authToken
    if (token) {
        res.setHeader("x-access-token", token)
        jwt.verify(token, req.app.get('authToken'), function(err, decoded) {
            if (err) {
                console.error("401 : Failed to authenticate token.  " + req.originalUrl)
                console.error(err)
                return res.status(401).json({ "status": "401", "message": "Failed to authenticate token.", "error" : JSON.stringify(err) })
            } else {
                req.decoded = decoded.encTokenData
                // console.log('req.decoded = ' + req.decoded)
                // Person.js Schema enum. ["USER", "ADMIN"]
                if (authorization.isUser(req.decoded.roles)) {
                    // console.log("200 : Authorized to access " + req.originalUrl)
                    return next()
                }
                console.error("401 : Failed to authenticate token.  " + req.originalUrl)
                return res.status(401).json({ "status": "401", "message": "Does not have privileges." })
            }
        })
    } else {
        console.error('403: No token provided.')
        res.status(403).json({ "status": "403", "message": "No token provided." })
    }
})

/************************************************************
 * Routes
 ***********************************************************/

// LOAD SITE ROUTES
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
        return next()
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
        return next(err)
    })
}

// TODO Check for ajax message before creating a new one.
app.use(apiPaths, function (err, req, res, next)
{
    console.log("API Error Handler")
    if (req.xhr) {
        if (app.get('env') === 'development') {
            console.log('API Error Handler')
            console.log(err)
        }
        return res.status(500).json({ "status": "500", "message": "API System Error", "error": err })
    }
    return next(err)
})

app.use(sitePaths, function (err, req, res, next)
{
    console.error('SITE Error Handler')
    if (app.get('env') === 'development') {
        //console.error('SITE Error Handler')
        console.log(err)
    }
    // SITE - Not Authorized
    if (err.statusCode == 401) {
        console.error('Not Authorized : ' + req.originalUrl)
        req.flash('warning', "You have been logged out")
        // return res.render('front/account/login')
        return res.redirect('/account/login')
    }

    // SITE - 4xx Client Errors
    if (res.statusCode >= 400 && res.statusCode < 500) {
        err = new Error('Error')
        res.statusCode = err.statusCode || 400
        return res.render('error', {
            title: res.statusCode + ' : Error',
            message: res.statusCode + ' : Error',
            error: (app.get('env') === 'development') ? err : res.statusMessage
        })
    }

    // SITE - 5xx Server Errors
    if (res.statusCode >= 500) {
        res.statusCode = err.status || 500
        return res.render('error', {
            title: res.statusCode + ' : Error',
            message: res.statusCode + ' : Error',
            error:  (app.get('env') === 'development') ? err : res.statusMessage
        })
    }

    // SITE - Ensure error reported
    err = new Error('System Error')
    err.statusCode = 500
    res.render('error', {
        title: '500 : System Error',
        message: '500 : System Error',
        error:  (app.get('env') === 'development') ? err : res.statusMessage
    })
})

module.exports = app
