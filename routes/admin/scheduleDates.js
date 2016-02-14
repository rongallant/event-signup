var express = require('express'),
    request = require('request'),
    path = require("path"),
    dateformat = require('dateformat')

var router = express.Router(),
    ScheduleDate = require("../../models/scheduleDate"),
    appSettings = require('../utils/appSettings')

var appDesc = []
appDesc['apiSingle'] = '/scheduleDate'
appDesc['apiCollection'] = '/scheduleDates'
appDesc['folder'] = '/scheduleDates'
appDesc['singularName'] = "Schedule Date"
appDesc['pluralName'] = "Schedule Dates"
router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * PAGES
 ************************************************************/

// LIST
router.get('/', function(req, res, next){
    request(res.locals.apiCollection, function (err, data) {
        if (err) { return next(err) }
        res.render(res.locals.listView, {
            title: appDesc['pluralName'],
            user: req.user,
            data: JSON.parse(data.body)
        })
    })
})

router.get('/success/:code', function(req, res, next) {
    if (req.params.code == 'deleted') {
        req.flash('success', 'Deleted successfully!')
        res.redirect(res.locals.listAction)
    }
})

router.get('/success/:code/:id', function(req, res, next) {
    if (req.params.code == 'updated') {
        req.flash('success', 'Updated successfully!')
    } else if (req.params.code == 'created') {
        req.flash('success', 'Created successfully!')
    }
    res.redirect(path.join(res.locals.editAction, req.params.id))
})

// EDIT
router.get('/edit/:id', function(req, res, next) {
    request(res.locals.apiItem, function (err, data){
        if (err) { return next(err) }
        res.render(res.locals.editView, {
            title: "Editing " + appDesc['singularName'],
            user: req.user,
            dateFormat: dateformat,
            data: JSON.parse(data.body),
            formMode: 'edit',
            formMethod: 'post',
            formAction: res.locals.apiItem
        })
    })
})

// CREATE
router.get('/create', function(req, res) {
    res.render(res.locals.editView, {
        title: 'Create New ' + appDesc['singularName'],
        user: req.user,
        data: new ScheduleDate(),
        dateFormat: dateformat,
        formMode: 'create',
        formMethod: 'post',
        formAction: res.locals.apiItem
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

module.exports = router
