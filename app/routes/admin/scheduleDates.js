var express = require('express'),
    request = require('request'),
    path = require("path")

var router = express.Router(),
    ScheduleDate = require("../../models/scheduleDate"),
    appSettings = require('../utils/appSettings')

var appDesc = []
appDesc['apiSingle'] = '/scheduleDate'
appDesc['apiCollection'] = '/scheduleDates'
appDesc['folder'] = '/scheduleDates'
appDesc['singularName'] = "Schedule Date"
appDesc['pluralName'] = "Schedule Dates",
appDesc['newObject'] = new ScheduleDate()
router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * PAGES
 ************************************************************/

function hasVal(variable){
    return (typeof variable !== 'undefined')
}

router.get('/edit/:id', function(req, res, next) {
    request({"uri":res.locals.apiItem + req.params.id}, function (err, data){
        if (err) { return next(err) }
        res.render(path.join(res.locals.editView), {
            title: "Editing " + appDesc['singularName'],
            user: req.user,
            data: JSON.parse(data.body).data,
            formMode: 'edit',
            formMethod: 'PUT',
            formAction: res.locals.apiItem + req.params.id
        })
    })
})

router.get('/create', function(req, res) {
    req.session.redirectTo = res.locals.editView
    res.render(res.locals.editView, {
        title: 'Create New ' + appDesc['singularName'],
        user: req.user,
        data: appDesc['newObject'],
        formMode: 'create',
        formMethod: 'POST',
        formAction: res.locals.apiItem
    })
})

router.get('/:currPage?', function(req, res, next){
    var apiUri = res.locals.apiCollection
    if (hasVal(req.params.currPage))
        apiUri += req.params.currPage
    else
        apiUri += 1
    if (hasVal(req.query.q))
        apiUri += '?q=' + req.query.q
    request({"uri":apiUri}, function (err, data) {
        if (err) { return next(err) }
        res.render(res.locals.listView, {
            title: appDesc['pluralName'],
            user: req.user,
            data: JSON.parse(data.body).data
        })
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

module.exports = router
