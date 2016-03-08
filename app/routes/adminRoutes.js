
/************************************************************
 * Admin
 ***********************************************************/

module.exports = function(app) {

    var admin = require('./admin/index'),
        adminEvents = require('./admin/events'),
        adminPersons = require('./admin/persons'),
        adminAddresses = require('./admin/addresses'),
        adminActivities = require('./admin/activities'),
        adminTasks = require('./admin/tasks'),
        adminMeals = require('./admin/meals')

    // Admin Section
    app.use('/admin', admin)
    app.use('/admin/events', adminEvents)
    app.use('/admin/persons', adminPersons)
    app.use('/admin/addresses', adminAddresses)
    app.use('/admin/activities', adminActivities)
    app.use('/admin/tasks', adminTasks)
    app.use('/admin/meals', adminMeals)

}