
/************************************************************
 * Admin
 ***********************************************************/

module.exports = function(app) {
    var admin = require('./admin/index'),
        adminActivities = require('./admin/activities'),
        adminAddresses = require('./admin/addresses'),
        adminEvents = require('./admin/events'),
        adminMeals = require('./admin/meals'),
        adminPersons = require('./admin/persons'),
        adminReservations = require('./admin/reservations'),
        adminTasks = require('./admin/tasks')

    // Admin Section
    app.use('/admin', admin)
    app.use('/admin/activities', adminActivities)
    app.use('/admin/addresses', adminAddresses)
    app.use('/admin/events', adminEvents)
    app.use('/admin/meals', adminMeals)
    app.use('/admin/persons', adminPersons)
    app.use('/admin/reservations', adminReservations)
    app.use('/admin/tasks', adminTasks)
}