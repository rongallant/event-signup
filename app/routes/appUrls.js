
/************************************************************
 * Application URLs and URIs
 ***********************************************************/

module.exports = function(app) {

    app.use(function(req, res, next) {

        // Site
        res.locals.fullUrl = 'https://' + req.get('host')

        res.locals.pageHome = '/' // index page
        res.locals.pageAbout = '/about'

        res.locals.pageAccountHome = '/guest'
        res.locals.pageAccountSignup = '/account/signup'
        res.locals.pageAccountComplete = '/account/complete'
        res.locals.pageAccountLogin = '/account/login'
        res.locals.pageAccountLogout = '/account/logout'

        res.locals.pageEvent = '/events'
        res.locals.pageEventSignup = '/events/signup'

        // Flash Messaging - Returns messages to users.
        res.locals.info = req.flash('info')
        res.locals.success = req.flash('success')
        res.locals.warning = req.flash('warning')
        res.locals.alert = req.flash('alert')
        res.locals.error = req.flash('error')

        // Admin
        res.locals.pageAdmin = '/admin'
        res.locals.pageAdminActivities = '/admin/activities'
        res.locals.pageAdminAddresses = '/admin/addresses'
        res.locals.pageAdminEvents = '/admin/events'
        res.locals.pageAdminMeals = '/admin/tasks/meals'
        res.locals.pageAdminPersons = '/admin/persons'
        res.locals.pageAdminReservations = '/admin/reservations'
        res.locals.pageAdminTasks = '/admin/tasks'

        // API
        res.locals.apiUri = {
            "public": {
                account : res.locals.fullUrl + '/public_api/account/',
                login : res.locals.fullUrl + '/public_api/account/login/',
                hasprofile : res.locals.fullUrl + '/public_api/account/hasprofile/'
            },
            "secure": {
                activity: res.locals.fullUrl + '/api/activity/',
                activities: {
                    base: res.locals.fullUrl + '/api/activities/',
                    byEvent: res.locals.fullUrl + '/api/activities/byEvent/',
                    byEventCount: res.locals.fullUrl + '/api/activities/byEventCount/'
                },
                address : res.locals.fullUrl + '/api/address/',
                addresses : res.locals.fullUrl + '/api/addresses/',
                event : {
                    base : res.locals.fullUrl + '/api/event/',
                    current : res.locals.fullUrl + '/api/event/current/',
                    deactivate : res.locals.fullUrl + '/api/event/deactivate/'
                },
                events : {
                    base : res.locals.fullUrl + '/api/events/',
                    disableOthers : res.locals.fullUrl + '/api/events/disableOthers/'
                },
                meal : res.locals.fullUrl + '/api/meal/',
                meals: {
                    base: res.locals.fullUrl + '/api/meals/',
                    byEvent: res.locals.fullUrl + '/api/meals/byEvent/',
                    byEventCount: res.locals.fullUrl + '/api/meals/byEventCount/'
                },
                person : {
                    base : res.locals.fullUrl + '/api/person/',
                    byUsername : res.locals.fullUrl + '/api/person/username/',
                    saveToken : res.locals.fullUrl + '/api/person/token/'
                },
                persons : {
                    base : res.locals.fullUrl + '/api/persons/',
                    byEventCount : res.locals.fullUrl + '/api/persons/byEventCount/'
                },
                reservation : {
                    base: res.locals.fullUrl + '/api/reservation/'
                },
                reservations : {
                    base: res.locals.fullUrl + '/api/reservations/',
                    byEvent: res.locals.fullUrl + '/api/reservations/byEvent/'
                },
                task : res.locals.fullUrl + '/api/task/',
                tasks : {
                    base: res.locals.fullUrl + '/api/tasks/',
                    byEvent: res.locals.fullUrl + '/api/tasks/byEvent/',
                }
            }
        }
        next()
    })
}