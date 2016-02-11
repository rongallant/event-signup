var express = require('express'),
    request = require('request'),
    path = require("path")

var router = express.Router(),
    Person = require('../../models/person'),
    appSettings = require('../utils/appSettings')

var appDesc = []
    appDesc['folder'] = '/persons',
    appDesc['singularName'] = "Person",
    appDesc['pluralName'] = "Persons"

router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc['folder'])
    next()
})

/************************************************************
 * PAGES
 ************************************************************/

// LIST
router.get('/', function(req, res, next){
    request(res.locals.apiAction, function (err, data) {
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
    }
    res.redirect(res.locals.listAction)
})

router.get('/success/:code/:id', function(req, res, next) {
    if (req.params.code == 'updated') {
        req.flash('success', 'Updated successfully!')
    } else if (req.params.code == 'created') {
        req.flash('success', 'Created successfully!')
    }
    res.redirect(path.join(res.locals.editAction, req.params.id))
})

// Create
router.get('/create', function(req, res) {
    res.render(res.locals.editView, {
        title: 'Create New ' + appDesc['singularName'],
        user: req.user,
        data: new Person(),
        formMode: 'create',
        formMethod: 'post',
        formAction: res.locals.apiAction
    })
})

// Edit
router.get('/edit/:id', function(req, res, next) {
    request(res.locals.apiAction + req.params.id), function (err, data){
        if (err) { return next(err) }
        res.render(res.locals.editView, {
            title: "Editing " + appDesc['singularName'],
            user: req.user,
            data: JSON.parse(data.body),
            formMode: 'edit',
            formMethod: 'PUT',
            formAction: res.locals.apiAction + req.params.id
        })
    }
})

module.exports = router
