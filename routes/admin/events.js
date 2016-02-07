var express = require('express')
var request = require('request');
var router = express.Router()

var Event = require("../../models/event")

var VIEW_FOLDER = "admin/events"
var URL_BASE = "/admin/events"
var entryName = "Event"
var entriesName = "Events"

/************************************************************
 * PAGES
 ************************************************************/

function localUrl(req) {
    return req.protocol + '://' + req.get('host')
}

router.use(function(req, res, next) {
    res.locals.list = URL_BASE
    res.locals.edit = URL_BASE + '/edit/'
    res.locals.create = URL_BASE + '/create'
    res.locals.url = req.originalUrl
    // console.log(req)
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
