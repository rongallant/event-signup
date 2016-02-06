/************************************************************
 * Dependencies
 ***********************************************************/

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var LocalStrategy = require('passport-local').Strategy
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
var sassMiddleware = require('node-sass-middleware')
var consoletable = require('console.table')

/************************************************************
 * Models
 ***********************************************************/

var Account = require('./models/account')

/************************************************************
 * Routes
 ***********************************************************/

var index = require('./routes/index')
var admin = require('./routes/admin')
var events = require('./routes/admin/events')
var login = require('./routes/login')

/************************************************************
 * App Config
 ***********************************************************/

var app = express()

app.locals.title = 'Hancon.com'
app.locals.email = 'ron@rongallant.com'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('view options', { layout: false })
app.use(logger('dev'))

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true})) // to support URL-encoded bodies
app.use(cookieParser('keyboard cat'))

// Session
  var sessionStore = new session.MemoryStore;
  app.use(session({
      cookie: { secure: false, maxAge: 1800000 }, // Timeout set to 30 minutes
      store: sessionStore,
      saveUninitialized: true,
      resave: true,
      secret: 'This is a crazy secret, Shjahsk'
  }))

// Flash Messaging - Returns messages to users.
app.use(flash());
app.use(function(req, res, next){
    res.locals.info = req.flash('info')
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// Sass
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets'),
    prefix: '/stylesheets',
    outputStyle: 'expanded',
    debug: true,
    force: true
}));

/************************************************************
 * Paths
 ***********************************************************/

// app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

app.use('/', index)
app.use('/admin', admin)
app.use('/admin/events', events)

/************************************************************
 * Database
 ***********************************************************/

// MongooseJS / MongoDB
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4')
mongoose.set('debug', true)

/************************************************************
 * Security
 ***********************************************************/

// app.use(passport.initialize())
// app.use(passport.session())

/************************************************************
 * Error Handling
 ***********************************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
