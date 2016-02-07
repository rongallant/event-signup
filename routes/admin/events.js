var express = require('express')
var mongoose = require('mongoose')
var Event = require("../../models/event")
var request = require('request');

var router = express.Router()

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

// FORM
router.get('/:id', function(req, res, next) {
    if (req.flash('code')  == 200) {
        req.flash('success', 'Update successfull!')
        res.redirect(URL_BASE + '/' + req.params.id);
    }
    next()
})

router.get('/:id', function(req, res) {
    request(localUrl(req) + '/api/event/' + req.params.id , function (err, body){
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

/************************************************************
 * PARTS
 ************************************************************/

router.get('/emailrow/:index', function(req, res) {
    res.render(VIEW_FOLDER +'/includes/email-row', {
        index:req.params.index
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

// use event API

module.exports = router
