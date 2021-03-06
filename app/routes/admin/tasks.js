var express = require('express'),
    request = require('request'),
    path = require("path"),
    moment = require('moment'),
    auth = require('../../helpers/authorization.js'),
    router = express.Router(),
    Task = require("../../models/task"),
    appSettings = require('../utils/appSettings'),
    appDesc = []

appDesc['apiSingle'] = '/task'
appDesc['apiCollection'] = '/tasks'
appDesc['folder'] = '/tasks'
appDesc['singularName'] = 'Task'
appDesc['pluralName'] = 'Tasks'
appDesc['newObject'] = new Task()

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

/**
 * I am the EDIT modal field content for editing inline tasks.
 */
router.get('/modal', auth.needsRole('ADMIN'), function(req, res, next) {
    res.render('admin/tasks/modal', {
        user: req.user,
        data: new Task(),
        isNew: 'true',
        moment: moment
    })
})

/**
 * I am the modal field content for editing inline tasks.
 */
router.get('/modal/:id', auth.needsRole('ADMIN'), function(req, res, next) {
    request({"uri":res.locals.apiItem + req.params.id, "headers":{"x-access-token":req.session.authToken}}, function (err, data){
        if (err) { return next(err) }
        res.render('admin/tasks/modal', {
            user: req.user,
            data: JSON.parse(data.body).data,
            isNew: 'false',
            moment: moment
        })
    })
})

router.get('/edit/:id', auth.needsRole('ADMIN'), function(req, res, next) {
    request({"uri":res.locals.apiItem + req.params.id, "headers":{"x-access-token":req.session.authToken}}, function (err, data){
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

router.get('/create', auth.needsRole('ADMIN'), function(req, res) {
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

router.get('/:currPage?', auth.needsRole('ADMIN'), function(req, res, next){
    var apiUri = res.locals.apiCollection
    if (hasVal(req.params.currPage))
        apiUri += req.params.currPage
    else
        apiUri += 1
    if (hasVal(req.query.q))
        apiUri += '?q=' + req.query.q

    request({"uri":apiUri, "headers":{"x-access-token":req.session.authToken}}, function (err, data) {
        if (err) { return next(err) }
        res.render(res.locals.listView, {
            title: appDesc['pluralName'],
            user: req.user,
            data: JSON.parse(data.body).data
        })
    })
})

module.exports = router
