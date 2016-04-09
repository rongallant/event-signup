var express = require('express'),
    request = require('request'),
    auth = require('../..//helpers/authorization.js'),
    moment = require("moment"),
    router = express.Router(),
    Event = require("../../models/event"),
    appSettings = require('../utils/appSettings'),
    appDesc = []

appDesc['apiSingle'] = '/event'
appDesc['apiCollection'] = '/events'
appDesc['folder'] = '/events'
appDesc['singularName'] = "Event"
appDesc['pluralName'] = "Events"
appDesc['newObject'] = new Event()

router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * PAGES
 ************************************************************/

function hasVal(variable){
    return (variable !== 'undefined' && variable)
}

var getActivities = function(req, res, next) {
    if (!hasVal(req.params.eventId)) {
        req.activitiesArray = []
        return next()
    }
    var apiUri = res.locals.apiUri.secure.activities.byEvent + req.params.eventId
    var auth = { "x-access-token": req.session.authToken }
    request({ "uri": apiUri, "headers": auth }, function (err, data) {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log('getActivities')
        console.log(JSON.parse(data.body).data)
        req.activitiesArray = JSON.parse(data.body).data
        return next()
    })
}

var getMeals = function(req, res, next) {
    if (!hasVal(req.params.eventId)) {
        req.mealsArray = []
        return next()
    }
    var apiUri = res.locals.apiUri.secure.meals.byEvent + req.params.eventId
    var auth = { "x-access-token": req.session.authToken }
    request({ "uri": apiUri, "headers": auth }, function (err, data) {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log('getMeals')
        console.log(JSON.parse(data.body).data)
        req.mealsArray = JSON.parse(data.body).data
        return next()
    })
}

var getTasks = function(req, res, next) {
    if (!hasVal(req.params.eventId)) {
        req.tasksArray = []
        return next()
    }
    var apiUri = res.locals.apiUri.secure.tasks.byEvent + req.params.eventId
    var auth = { "x-access-token": req.session.authToken }
    request({ "uri": apiUri, "headers": auth }, function (err, data) {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log('getTasks')
        console.log(JSON.parse(data.body).data)
        req.tasksArray = JSON.parse(data.body).data
        return next()
    })
}

router.get('/edit/:eventId', auth.needsRole('ADMIN'), getActivities, getMeals, getTasks, function(req, res, next) {
    var apiUri =  res.locals.apiUri.secure.event.base + req.params.eventId
    var auth = { "x-access-token": req.session.authToken }
    try {
        request({ "uri": apiUri, "headers": auth }, function (err, data){
            if (err) { return next(err) }
            res.render(res.locals.editView, {
                title: "Editing " + appDesc['singularName'],
                user: req.user,
                data: JSON.parse(data.body).data,
                meals: req.mealsArray,
                activities: req.activitiesArray,
                tasks: req.tasksArray,
                formMode: 'edit',
                formMethod: 'PUT',
                formAction: res.locals.apiUri.secure.event.base
            })
        })
    } catch(err) {
        return next(err)
    }
})

router.get('/create', auth.needsRole('ADMIN'), function(req, res) {
    req.session.redirectTo = res.locals.editView
    res.render(res.locals.editView, {
        title: 'Create New ' + appDesc['singularName'],
        user: req.user,
        data: appDesc['newObject'],
        formMode: 'create',
        formMethod: 'POST',
        formAction: res.locals.apiUri.secure.event.base
    })
})

// Default list view
router.get('/:currPage?', auth.needsRole('ADMIN'), function(req, res, next){
    res.locals.moment = moment
    var apiUri = res.locals.apiUri.secure.events.base
    if (hasVal(req.params.currPage))
        apiUri += req.params.currPage
    else
        apiUri += 1
    if (hasVal(req.query.q))
        apiUri += '?q=' + req.query.q

    console.log('res.locals.listView')
    console.log(res.locals.listView)

    request({uri: apiUri, headers: {"x-access-token":req.session.authToken} }, function (err, data) {
        if (err) { return next(err) }
        res.render("admin/events/listPanels", {
            title: appDesc['pluralName'],
            user: req.user,
            data: JSON.parse(data.body).data
        })
    })
})

// Table list view
router.get('/list/:currPage?', auth.needsRole('ADMIN'), function(req, res, next){
    res.locals.moment = moment
    var apiUri = res.locals.apiUri.secure.events.base
    if (hasVal(req.params.currPage))
        apiUri += req.params.currPage
    else
        apiUri += 1
    if (hasVal(req.query.q))
        apiUri += '?q=' + req.query.q

    request({uri: apiUri, headers: {"x-access-token":req.session.authToken} }, function (err, data) {
        if (err) { return next(err) }

        res.render(res.locals.listView, {
            title: appDesc['pluralName'],
            user: req.user,
            data: JSON.parse(data.body).data
        })
    })
})

module.exports = router
