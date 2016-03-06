/************************************************************
 * Pages
 ***********************************************************/

var index = require('./routes/index'),
    account = require('./routes/account'),
    events = require('./routes/events'),
    guests = require('./routes/guests'),

    admin = require('./routes/admin/index'),
    adminEvents = require('./routes/admin/events'),
    adminPersons = require('./routes/admin/persons'),
    adminAddresses = require('./routes/admin/addresses'),

    adminScheduleDates = require('./routes/admin/scheduleDates'),
    adminActivities = require('./routes/admin/activities'),
    adminTasks = require('./routes/admin/tasks'),
    adminMeals = require('./routes/admin/meals')

/************************************************************
 * Rest API
 ***********************************************************/

var
    apiAccountPublic = require('./routes/public_api/account'),

    apiActivity = require('./routes/api/activity'),
    apiActivities = require('./routes/api/activities'),

    apiAddress = require('./routes/api/address'),
    apiAddresses = require('./routes/api/addresses'),

    apiEvent = require('./routes/api/event'),
    apiEvents = require('./routes/api/events'),

    apiMeal = require('./routes/api/meal'),
    apiMeals = require('./routes/api/meals'),

    apiPerson = require('./routes/api/person'),
    apiPersons = require('./routes/api/persons'),

    apiReservation = require('./routes/api/reservation'),

    apiScheduleDate = require('./routes/api/scheduleDate'),
    apiScheduleDates = require('./routes/api/scheduleDates'),

    apiTask = require('./routes/api/task'),
    apiTasks = require('./routes/api/tasks')

module.exports = function(app, passport) {

    app.use(function(req, res, next){

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

        res.locals.pageAdmin = '/admin'
        res.locals.pageAdminEvents = '/admin/events'
        res.locals.pageAdminPersons = '/admin/persons'
        res.locals.pageAdminAddresses = '/admin/addresses'
        res.locals.pageAdminScheduleDates = '/admin/scheduleDates'
        res.locals.pageAdminActivities = '/admin/activities'
        res.locals.pageAdminTasks = '/admin/tasks'
        res.locals.pageAdminMeals = '/admin/tasks/meals'

        // API
        res.locals.apiUri = {
            "public": {
                account : res.locals.fullUrl + '/public_api/account/'
            },
            "secure": {
                activity : res.locals.fullUrl + '/api/activity/',
                activities : res.locals.fullUrl + '/api/activities/',
                address : res.locals.fullUrl + '/api/address/',
                addresses : res.locals.fullUrl + '/api/addresses/',
                event : {
                    base : res.locals.fullUrl + '/api/event/',
                    latest : res.locals.fullUrl + '/api/event/latest/'
                },
                events : res.locals.fullUrl + '/api/events/',
                meal : res.locals.fullUrl + '/api/meal/',
                meals : res.locals.fullUrl + '/api/meals/',
                person : {
                    base : res.locals.fullUrl + '/api/person/',
                    byUsername : res.locals.fullUrl + '/api/person/username/',
                    saveToken : res.locals.fullUrl + '/api/person/token/'
                },
                persons : res.locals.fullUrl + '/api/persons/',
                reservation : {
                    base: res.locals.fullUrl + '/api/reservation/'
                },
                scheduleDate : res.locals.fullUrl + '/api/scheduleDate/',
                scheduleDates : res.locals.fullUrl + '/api/scheduleDates/',
                task : res.locals.fullUrl + '/api/task/',
                tasks : res.locals.fullUrl + '/api/tasks/'
            }
        }

        // Flash Messaging - Returns messages to users.
        res.locals.info = req.flash('info')
        res.locals.success = req.flash('success')
        res.locals.error = req.flash('error')
        next()
    })

    // Unauthorized Areas

    app.use('/', index)

    app.use('/account', account)
    app.use('/public_api/account', apiAccountPublic)

    app.use('/guest', guests)
    app.use('/api/reservation', apiReservation)

    app.use('/events', events)

    // Admin Section

    app.use('/admin', admin)

    app.use('/admin/events', adminEvents)
    app.use('/api/event', apiEvent)
    app.use('/api/events', apiEvents)

    app.use('/admin/persons', adminPersons)
    app.use('/api/person', apiPerson)
    app.use('/api/persons', apiPersons)

    app.use('/admin/addresses', adminAddresses)
    app.use('/api/address', apiAddress)
    app.use('/api/addresses', apiAddresses)

    app.use('/admin/scheduleDates', adminScheduleDates)
    app.use('/api/scheduleDate', apiScheduleDate)
    app.use('/api/scheduleDates', apiScheduleDates)

    app.use('/admin/activities', adminActivities)
    app.use('/api/activity', apiActivity)
    app.use('/api/activities', apiActivities)

    app.use('/admin/tasks', adminTasks)
    app.use('/api/task', apiTask)
    app.use('/api/tasks', apiTasks)

    app.use('/admin/meals', adminMeals)
    app.use('/api/meal', apiMeal)
    app.use('/api/meals', apiMeals)
}