var express = require('express')
var mongoose = require('mongoose')
var Event = require("../../models/event")

var router = express.Router()

var VIEW_FOLDER = "admin/events"
var URL_BASE = "/admin/events"
var entryName = "Event"
var entriesName = "Events"

/************************************************************
 * PAGES
 ************************************************************/

// LIST
router.get('/', function(req, res){
    Event.find(function(err, data) {
        if (err) console.log(err.message);
        res.render(VIEW_FOLDER +'/list', {
            title: entriesName,
            user: req.user,
            data: data
        })
    })
})

// FORM
router.get('/create', function(req, res) {
    var data = new Event()
    res.render(VIEW_FOLDER + '/edit', {
        title: "Create new " + entryName,
        user: req.user,
        data: data,
        saveAction: ''
    })
})

// FORM
// router.get('/edit/:eventid', function(req, res) {
router.get('/edit', function(req, res) {
    Event.findOne({ '_id': req.params.eventid }, function (err, data) {
        if (err) console.log(err.message)
        if (!data) data = new Event()
        res.render(VIEW_FOLDER + '/edit', {
            title: "Editing " + entryName,
            user: req.user,
            data: data,
            saveAction: ''
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
