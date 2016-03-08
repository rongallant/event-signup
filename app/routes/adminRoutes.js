
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

    app.use(function(req, res, next){

        // App URL Paths
        res.locals.pageAdmin = '/admin'
        res.locals.pageAdminEvents = '/admin/events'
        res.locals.pageAdminPersons = '/admin/persons'
        res.locals.pageAdminAddresses = '/admin/addresses'
        res.locals.pageAdminScheduleDates = '/admin/scheduleDates'
        res.locals.pageAdminActivities = '/admin/activities'
        res.locals.pageAdminTasks = '/admin/tasks'
        res.locals.pageAdminMeals = '/admin/tasks/meals'

        next()
    })

    // Admin Section
    app.use('/admin', admin)
    app.use('/admin/events', adminEvents)
    app.use('/admin/persons', adminPersons)
    app.use('/admin/addresses', adminAddresses)
    app.use('/admin/activities', adminActivities)
    app.use('/admin/tasks', adminTasks)
    app.use('/admin/meals', adminMeals)

}