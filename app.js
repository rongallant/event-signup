/************************************************************
 * Dependencies
 ***********************************************************/

var express = require('express'),
  path = require('path'),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  flash = require('connect-flash'),
  consoletable = require('console.table'),
  methodOverride = require('method-override'),
  dateformat = require('dateformat'),
  mongoosePages = require('mongoose-paginate')

/************************************************************
 * Models
 ***********************************************************/

var Account = require('./models/account')

/************************************************************
 * Routes
 ***********************************************************/

var index = require('./routes/index'),
  login = require('./routes/login'),
  admin = require('./routes/admin'),
  events = require('./routes/admin/events'),
  persons = require('./routes/admin/persons'),
  addresses = require('./routes/admin/addresses'),
  scheduleDates = require('./routes/admin/scheduleDates'),
  activities = require('./routes/admin/activities'),
  tasks = require('./routes/admin/tasks'),
  meals = require('./routes/admin/meals')

/************************************************************
 * Rest API
 ***********************************************************/

var apiEvent = require('./routes/api/event'),
  apiEvents = require('./routes/api/events'),

  apiPerson = require('./routes/api/person'),
  apiPersons = require('./routes/api/persons'),

  apiAddress = require('./routes/api/address'),
  apiAddresses = require('./routes/api/addresses'),

  apiScheduleDate = require('./routes/api/scheduleDate'),
  apiScheduleDates = require('./routes/api/scheduleDates'),

  apiActivity = require('./routes/api/activity'),
  apiActivities = require('./routes/api/activities'),

  apiTask = require('./routes/api/task'),
  apiTasks = require('./routes/api/tasks'),

  apiMeal = require('./routes/api/meal'),
  apiMeals = require('./routes/api/meals')

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
app.use(session({
    cookie: { secure: false, maxAge: 1800000 }, // Timeout set to 30 minutes
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: true,
    secret: 'This is a crazy secret, Shjahsk'
}))

// Route that creates a flash message using the express-flash module
app.all('/express-flash', function( req, res ) {
    req.flash('success', 'This is a flash message using the express-flash module.');
    res.redirect(301, '/');
});

app.use(flash());
app.use(function(req, res, next){
    // Flash Messaging - Returns messages to users.
    res.locals.info = req.flash('info')
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    // res.locals.moment = require('moment') // Date formatter
    next()
})

/************************************************************
 * Paths
 ***********************************************************/

// app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/themes', express.static(path.join(__dirname, 'node_modules', 'semantic-ui-less', 'themes')))
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'semantic-ui-daterangepicker')))
app.use('/javascripts', express.static(path.join(__dirname, 'semantic', 'dist')))
app.use('/pickadate', express.static(path.join(__dirname, 'node_modules', 'pickadate', 'lib', 'compressed')))
app.use('/moment', express.static(path.join(__dirname, 'node_modules', 'moment', 'min')))

app.use('/', index)
app.use('/admin', admin)

app.use('/admin/events', events)
app.use('/api/event', apiEvent)
app.use('/api/events', apiEvents)

app.use('/admin/persons', persons)
app.use('/api/person', apiPerson)
app.use('/api/persons', apiPersons)

app.use('/admin/addresses', addresses)
app.use('/api/address', apiAddress)
app.use('/api/addresses', apiAddresses)

app.use('/admin/scheduleDates', scheduleDates)
app.use('/api/scheduleDate', apiScheduleDate)
app.use('/api/scheduleDates', apiScheduleDates)

app.use('/admin/activities', activities)
app.use('/api/activity', apiActivity)
app.use('/api/activities', apiActivities)

app.use('/admin/tasks', tasks)
app.use('/api/task', apiTask)
app.use('/api/tasks', apiTasks)

app.use('/admin/meals', meals)
app.use('/api/meal', apiMeal)
app.use('/api/meals', apiMeals)

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

app.use(function(req, res, next) {
  res.status(200)
  var err = new Error('Yay!')
  err.status = 200
  next(err);
});

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
  });
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}

module.exports = app;
