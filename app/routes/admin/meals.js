var express = require('express'),
    request = require('request'),
    moment = require('moment'),
    path = require("path"),
    auth = require('../../helpers/authorization.js'),
    router = express.Router(),
    Meal = require("../../models/meal"),
    appSettings = require('../utils/appSettings'),
    appDesc = []

appDesc['apiSingle'] = '/meal'
appDesc['apiCollection'] = '/meals'
appDesc['folder'] = '/meals'
appDesc['singularName'] = 'Meal'
appDesc['pluralName'] = 'Meals'
appDesc['newObject'] = new Meal()

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

/**
 * I am the EDIT modal field content for editing inline meals.
 */
router.get('/modal', auth.needsRole('ADMIN'), function(req, res, next) {
    res.render('admin/meals/modal', {
        user: req.user,
        data: new Meal(),
        isNew: 'true'
    })
})

/**
 * I am the EDIT modal field content for editing inline meals.
 */
router.get('/modal/:id', auth.needsRole('ADMIN'), function(req, res, next) {
    request({"uri":res.locals.apiItem + req.params.id, "headers":{"x-access-token":req.session.authToken}}, function (err, data){
        if (err) { return next(err) }
        console.log(data.body)
        res.render('admin/meals/modal', {
            user: req.user,
            data: JSON.parse(data.body).data,
            isNew: 'false',
            moment: moment
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
