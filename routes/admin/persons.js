var express = require('express'),
    request = require('request'),
    router = express.Router(),
    path = require("path"),
    url = require("url")

var Person = require('../../models/person')

var API_URI = "/api/person/",
    VIEW_FOLDER = "admin/persons",
    URL_BASE = "/admin/persons",
    entryName = "Person",
    entriesName = "Persons"

/************************************************************
 * PAGES
 ************************************************************/

router.use(function(req, res, next) {
    res.locals.list = URL_BASE
    res.locals.edit = path.join(URL_BASE, 'edit/')
    res.locals.create = path.join(URL_BASE, 'create')
    res.locals.delete = path.join(URL_BASE, 'delete')
    res.locals.url = req.originalUrl
    next()
})

router.get('/success/:code', function(req, res, next) {
    if (req.params.code == 'deleted') {
        req.flash('success', 'Deleted successfully!')
    }
    res.redirect(URL_BASE + '/')
    next()
})

router.get('/success/:code/:id', function(req, res, next) {
    if (req.params.code == 'updated') {
        req.flash('success', 'Updated successfully!')
        res.redirect(URL_BASE + '/edit/' + req.params.id)
    } else
    if (req.params.code == 'created') {
        req.flash('success', 'Created successfully!')
        res.redirect(URL_BASE + '/edit/' + req.params.id)
    } else {
        res.redirect(URL_BASE + '/')
    }
    next()
})

// LIST
router.get('/', function(req, res, next){
    request(localUrl(req) + API_URI, function (err, data) {
        if (err) console.log(err.message)
        res.render(VIEW_FOLDER +'/list', {
            title: entriesName,
            user: req.user,
            data: JSON.parse(data.body)
        })
    })
})

// Create
router.get('/create', function(req, res) {
    res.render(path.join(VIEW_FOLDER + '/edit'), {
        title: 'Create New ' + entryName,
        user: req.user,
        data: new Person(),
        formMethod: 'post',
        formAction: API_URI
    })
})

// Edit
router.get('/edit/:id', function(req, res) {
    request(localUrl(req) + API_URI + '/' + req.params.id, function (err, data){
        if (err) console.log(err.message)
        try {
            res.render(VIEW_FOLDER + '/edit', {
                title: "Editing " + entryName,
                user: req.user,
                data: JSON.parse(data.body),
                formMethod: 'put',
                formAction: API_URI + data.body.id
            })
        } catch (err) {
            console.error('ERROR: ' + err.stack);
            res.status(500).json({ error: err })
        }
    })
})

function localUrl(req) {
    return req.protocol + '://' + req.get('host')
}

module.exports = router
