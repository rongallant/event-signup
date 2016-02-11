var express = require('express'),
    request = require('request'),
    path = require("path"),
    url = require("url")

var router = express.Router(),
    Event = require("../../models/event")

var VIEW_FOLDER = "admin/events",
    URL_BASE = "/admin/events",
    entryName = "Event",
    entriesName = "Events"

/************************************************************
 * PAGES
 ************************************************************/

function localUrl(req) {
    return req.protocol + '://' + req.get('host')
}

router.use(function(req, res, next) {
    res.locals.listAction = URL_BASE
    res.locals.editAction = path.join(URL_BASE, 'edit/')
    res.locals.createAction = path.join(URL_BASE, 'create')
    res.locals.deleteAction = path.join(URL_BASE, 'delete')
    res.locals.url = req.originalUrl
    next()
})

// LIST
router.get('/', function(req, res, next){
    request(localUrl(req) + '/api/event', function (err, data) {
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
        res.redirect(URL_BASE + '/')
    }
    next()
})

router.get('/success/:code/:id', function(req, res, next) {
    if (req.params.code == 'updated') {
        req.flash('success', 'Updated successfully!')
        res.redirect(URL_BASE + '/edit/' + req.params.id)
    }
    if (req.params.code == 'created') {
        req.flash('success', 'Created successfully!')
        res.redirect(URL_BASE + '/edit/' + req.params.id)
    }
    next()
})

// FORM
router.get('/edit/:id', function(req, res) {
    request(localUrl(req) + '/api/event/' + req.params.id, function (err, body){
        if (err) console.log(err.message)
        res.render(VIEW_FOLDER + '/edit', {
            title: "Editing " + entryName,
            user: req.user,
            data: JSON.parse(body.body),
            formMode: 'edit',
            formMethod: 'post',
            formAction: '/api/event/' + JSON.parse(body.body).id
        })
    })
})

router.get('/create', function(req, res) {
    console.log('Create Event')
    res.render(VIEW_FOLDER + '/edit', {
        title: 'Create New ' + entryName,
        user: req.user,
        data: new Event(),
        formMode: 'create',
        formMethod: 'post',
        formAction: '/api/event/'
    })
})

/************************************************************
 * PARTS
 ************************************************************/

/************************************************************
 * ACTIONS
 ************************************************************/

// use event API

module.exports = router
