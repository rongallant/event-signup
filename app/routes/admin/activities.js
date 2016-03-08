var express = require('express'),
    request = require('request'),
    path = require("path")

var router = express.Router(),
    Activity = require("../../models/activity"),
    appSettings = require('../utils/appSettings')

var appDesc = []
appDesc['apiSingle'] = '/activity'
appDesc['apiCollection'] = '/activities'
appDesc['folder'] = '/activities'
appDesc['singularName'] = 'Activity'
appDesc['pluralName'] = 'Activities'
appDesc['newObject'] = new Activity()
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
        console.log('Activity')
    request({"uri":res.locals.apiItem + req.params.id}, function (err, data){
        if (err) {
            console.error(err)
            return next(err) }
        console.log('Activity data')
        console.log(JSON.parse(data.body).data)

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

router.get('/:currPage?', function(req, res, next) {
    try {
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
    } catch(err) {
        return next(err)
    }
})

module.exports = router
