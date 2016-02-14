var express = require('express'),
    request = require('request'),
    path = require("path")

var router = express.Router(),
    Event = require("../../models/event"),
    appSettings = require('../utils/appSettings')

var appDesc = []
appDesc['apiSingle'] = '/event'
appDesc['apiCollection'] = '/events'
appDesc['folder'] = '/events'
appDesc['singularName'] = "Event"
appDesc['pluralName'] = "Events"
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
        res.redirect(path.join(res.locals.editAction, req.params.id))
    }
    if (req.params.code == 'created') {
        req.flash('success', 'Created successfully!')
        res.redirect(path.join(res.locals.editAction, req.params.id))
    }
})

// FORM
router.get('/edit/:id', function(req, res, next) {
    request(res.locals.apiCollection + req.params.id, function (err, body){
        if (err) { return next(err) }
        res.render(path.join(res.locals.editView), {
            title: "Editing " + appDesc['singularName'],
            user: req.user,
            data: JSON.parse(body.body),
            formMode: 'edit',
            formMethod: 'post',
            formAction: res.locals.apiCollection + req.params.id
        })
    })
})

router.get('/create', function(req, res) {
    res.render(res.locals.editView, {
        title: 'Create New ' + appDesc['singularName'],
        user: req.user,
        data: new Event(),
        formMode: 'create',
        formMethod: 'post',
        formAction: res.locals.apiCollection
    })
})

module.exports = router
