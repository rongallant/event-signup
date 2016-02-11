var express = require('express'),
    request = require('request'),
    dateformat = require('dateformat'),
    path = require("path"),
    url = require("url")

var router = express.Router(),
    ScheduleDate = require("../../models/scheduleDates")

var API_URI = "/api/scheduleDates/",
    VIEW_FOLDER = "admin/scheduleDates",
    URL_BASE = "/admin/scheduleDates",
    entryName = "Schedule Date",
    entriesName = "Schedule Dates"

/************************************************************
 * PAGES
 ************************************************************/

router.use(function(req, res, next) {
    res.locals.apiAction = API_URI
    res.locals.listAction = URL_BASE
    res.locals.editAction = path.join(URL_BASE, 'edit/')
    res.locals.createAction = path.join(URL_BASE, 'create')
    res.locals.deleteAction = path.join(URL_BASE, 'delete')
    res.locals.url = req.originalUrl
    next()
})

// LIST
router.get('/', function(req, res, next){
    request(API_URI, function (err, data) {
        if (err) console.log(err.message)
        res.render(VIEW_FOLDER +'/list', {
            title: entriesName,
            user: req.user,
            data: JSON.parse(data.body)
        })
    })
})

router.get('/success/:code', function(req, res, next) {
    if (req.params.code == 'deleted') {
        req.flash('success', 'Deleted successfully!')
        res.redirect(URL_BASE)
    }
})

router.get('/success/:code/:id', function(req, res, next) {
    if (req.params.code == 'updated') {
        req.flash('success', 'Updated successfully!')
    } else if (req.params.code == 'created') {
        req.flash('success', 'Created successfully!')
    }
    res.redirect(path.join(URL_BASE, 'edit', req.params.id))
})

// FORM
router.get('/edit/:id', function(req, res) {
    request(path.join(API_URI + req.params.id), function (err, data){
        if (err) console.log(err.message)
        res.render(path.join(VIEW_FOLDER, 'edit'), {
            title: "Editing " + entryName,
            user: req.user,
            dateFormat: dateformat,
            data: JSON.parse(data.body),
            formMode: 'edit',
            formMethod: 'post',
            formAction: API_URI
        })
    })
})

router.get('/create', function(req, res) {
    res.render(path.join(VIEW_FOLDER, 'edit'), {
        title: 'Create New ' + entryName,
        user: req.user,
        data: new ScheduleDate(),
        dateFormat: dateformat,
        formMode: 'create',
        formMethod: 'post',
        formAction: API_URI
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

// use event API

module.exports = router
