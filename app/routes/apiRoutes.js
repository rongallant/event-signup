
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
        apiReservations = require('./api/reservations'),

        apiTask = require('./api/task'),
        apiTasks = require('./api/tasks')

    // API
    app.use('/api/activity', apiActivity)
    app.use('/api/activities', apiActivities)

    app.use('/api/address', apiAddress)
    app.use('/api/addresses', apiAddresses)

    app.use('/api/event', apiEvent)
    app.use('/api/events', apiEvents)

    app.use('/api/meal', apiMeal)
    app.use('/api/meals', apiMeals)

    app.use('/api/person', apiPerson)
    app.use('/api/persons', apiPersons)

    app.use('/api/reservation', apiReservation)
    app.use('/api/reservations', apiReservations)

    app.use('/api/task', apiTask)
    app.use('/api/tasks', apiTasks)
}