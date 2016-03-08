
/************************************************************
 * Rest API
 ***********************************************************/

module.exports = function(app) {

    var
        apiActivity = require('./api/activity'),
        apiActivities = require('./api/activities'),

        apiAddress = require('./api/address'),
        apiAddresses = require('./api/addresses'),

        apiEvent = require('./api/event'),
        apiEvents = require('./api/events'),

        apiMeal = require('./api/meal'),
        apiMeals = require('./api/meals'),

        apiPerson = require('./api/person'),
        apiPersons = require('./api/persons'),

        apiReservation = require('./api/reservation'),

        apiTask = require('./api/task'),
        apiTasks = require('./api/tasks')

    app.use(function(req, res, next){

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

        next()
    })

    // API
    app.use('/api/event', apiEvent)
    app.use('/api/events', apiEvents)

    app.use('/api/person', apiPerson)
    app.use('/api/persons', apiPersons)

    app.use('/api/address', apiAddress)
    app.use('/api/addresses', apiAddresses)

    app.use('/api/activity', apiActivity)
    app.use('/api/activities', apiActivities)

    app.use('/api/task', apiTask)
    app.use('/api/tasks', apiTasks)

    app.use('/api/meal', apiMeal)
    app.use('/api/meals', apiMeals)
}