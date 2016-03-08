var express = require('express'),
    request = require('request'),
    path = require("path"),
    authorization = require('../..//helpers/authorization.js'),
    router = express.Router(),
    Address = require('../../models/address'),
    appSettings = require('../utils/appSettings'),
    countries = require("i18n-iso-countries"),
    appDesc = []

appDesc['apiSingle'] = '/address'
appDesc['apiCollection'] = '/addresses'
appDesc['folder'] = '/addresses'
appDesc['singularName'] = "Address"
appDesc['pluralName'] = "Addresses"
appDesc['newObject'] = new Address()

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
    try {
        request({"uri":res.locals.apiItem + req.params.id, "headers":{"x-access-token":req.session.authToken}}, function (err, data){
            if (err) { return next(err) }
            authorization.apiRequestErrorHandler(req, res, data, next)
            res.locals.countries = countries
            res.render(path.join(res.locals.editView), {
                title: "Editing " + appDesc['singularName'],
                user: req.user,
                data: JSON.parse(data.body).data,
                formMode: 'edit',
                formMethod: 'PUT',
                formAction: res.locals.apiItem + req.params.id
            })
        })
    } catch(err) {
        return next(err)
    }
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
    try {
        var apiUri = res.locals.apiCollection
        if (hasVal(req.params.currPage))
            apiUri += req.params.currPage
        else
            apiUri += 1
        if (hasVal(req.query.q))
            apiUri += '?q=' + req.query.q
        request({"uri":apiUri, "headers":{'x-access-token':req.session.authToken}}, function (err, data) {
            if (err) { throw new Error(err) }
            authorization.apiRequestErrorHandler(req, res, data, next)
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
