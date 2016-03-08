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

var app = express()
var configAuth = require('./config/auth.js')

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

var configDB = require('./config/database.js')

// MongooseJS / MongoDB
mongoose.connect(configDB.url)
mongoose.set('debug', true)
app.set('authToken', configDB.secret); // secret variable

/************************************************************
 * Security
 ***********************************************************/

require('./config/passport')(app, passport); // pass passport for configuration
var authorization = require('./app/helpers/authorization.js')

/************************************************************
 * Routes
 ***********************************************************/

app.use(function(req, res, next) {
    console.log('\nSTART add token to header')
    console.log('req.session.authToken = ' + req.session.authToken)
    if (req.session.authToken) {
        console.log('Setting header token = ' + req.session.authToken)
        res.setHeader("x-access-token", req.session.authToken)
    }
    console.log('START add token to header\n')
    next()
})

// app.all(["/admin*", "/guest*"], function(req, res, next) {
app.all(function(req, res, next) {
    authorization.pageIsAuthenticated(req, res, next)
})

// May need to implement JSON Web Token
app.all(["/api*"], function(req, res, next) {
    authorization.apiIsAuthenticated(req, res, next)
})

require('./app/routes.js')(app, passport) // load our routes and pass in our app and fully configured passport

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

function isNull(varName) {
    return typeof varName == 'undefined'
}

app.use(function(req, res, next) {
    console.log('Verify Token')
    var token = req.body.token || req.query.token || req.headers['x-access-token']
    if (token) {
        console.log('userToken = ' + token)
        console.log("authToken = " + app.get('authToken'))
        jwt.verify(token, app.get('authToken'), function(err, decoded) {
            if (err) {
                console.log(err)
                return res.status(401).json({ "status": 401, "message": "Failed to authenticate token.", "error" : err })
            } else {
                req.decoded = decoded
                console.log('Successfully Authenticated Token')
                return next()
            }
        })
    } else {
        return res.status(403).json({ "status": 403, "message": "No token provided." })
    }
})

// Non Errors
app.use(function (req, res, next) {
    console.log('\nNon Errors')
    console.log('res.url = ' + res.url)
    console.log('res.statusCode = ' + res.statusCode)
    console.log('res.statusMessage = ' + res.statusMessage)
    console.log('res.headersSent: ' + res.headersSent)
    console.log('Ajax Request: ' + req.xhr)
    console.log('\n')
    next()
})

// NotAuthorized
// app.use(function (err, req, res, next) {
//     if (isNull(req.user) || err.status == 401) {
//         console.error('Not Authorized : ' + err.message)
//         err = new Error('Not Authorized')
//         err.status = 401
//         req.flash('warning', "You have been logged out")
//         return res.redirect('/account/login')
//     }
//     next(err)
// })

app.use(function (err, req, res, next) {
    if (isNull(res.statusCode) && isNull(res.status)) {
        console.log('Had No Error Code')
        console.log('res.body = ' + res.body)
        res.status(500)
        res.statusCode = 500
    }
    if (isNull(res.statusMessage)) {
        res.statusMessage = err.getMessage
    }
    console.log('\nDebug errors')
    console.log('res.url = ' + res.url)
    console.log('req.session.authToken = ' + req.session.authToken)
    console.log('res.statusCode = ' + res.statusCode)
    console.log('res.statusMessage = ' + res.statusMessage)
    console.log('res.headersSent: ' + res.headersSent)
    console.log('Ajax Request: ' + req.xhr)
    console.log('\n')
    if (req.xhr) {
        console.log('XHR Error')
        console.log(err)
        return res.status(500).json({'status' : 500, 'message' : 'There was an error processing your request'})
    }
    next(err)
})

// 5xx Server Errors
app.use(function (err, req, res, next) {
    console.log('res.body = ' + res.body)
    if (res.statusCode >= 500) {
        res.status(err.status || 500)
        return res.render('error', {
            message: err.message,
            error: err
        })
    }
    next(err)
})

// 4xx Client Errors
app.use(function(err, req, res, next) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
        // res.status(err.status || 400)
        return res.render('error', {
            message: err.message,
            error: err
        })
    }
    next(err)
})

// Ensure error reported
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.render('error', {
        message: err.message,
        error: err
    })
})


// catch 404 and forward to error handler
// app.use(function(req, res, next) {

//     console.error('catch 404 : Page Not Found')
//     var err = new Error('Page Not Found')
//     err.status = 404
//     next(err)
// })

// app.all(["/api*"], function(err, req, res, next) {
//     console.error('try and catch api error')
//     console.error(err)
//     res.status(500).json({ "status" : "error", "message" : err.message })
// })

// catch all errors and forward to error handler
// app.all(function(err, req, res, next) {

//     console.error('catch err : ' + err)
//     err = new Error('Not Authorized')
//     err.status = 401
//     res.redirect('/account/login')
// })

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.all(function(err, req, res, next) {
//         console.error('500 : ' + err.message)
//         res.status(err.status || 500)
//         res.render('error', {
//             message: err.message,
//             error: err
//         })
//     })
// }

// // production error handler
// // no stacktraces leaked to user
// app.all(function(err, req, res, next) {
//     res.status(err.status || 500)
//     console.error('500 : ' + err.message)
//     res.render('error', {
//         message: err.message,
//         error: {}
//     })
// })

module.exports = app
