var express = require('express'),
    request = require('request'),
    auth = require("../../helpers/authorization"),
    path = require("path"),
    router = express.Router(),
    Person = require('../../models/person'),
    appSettings = require('../utils/appSettings'),
    appDesc = []

appDesc['apiSingle'] = '/person'
appDesc['apiCollection'] = '/persons'
appDesc['folder'] = '/persons'
appDesc['singularName'] = "Person"
appDesc['pluralName'] = "Persons"
appDesc['newObject'] = new Person()

router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * PAGES
 ************************************************************/

function hasVal(variable) {
    return (variable !== 'undefined' && variable)
}

router.get('/edit/:id', auth.needsRole('ADMIN'), function(req, res, next) {
    request({"uri":res.locals.apiUri.secure.person.base + req.params.id, "headers":{'x-access-token':req.session.authToken}}, function (err, data){
        if (err) { return next(err) }
        res.render(path.join(res.locals.editView), {
            title: "Editing " + appDesc['singularName'],
            user: req.user,
            data: JSON.parse(data.body).data,
            formMode: 'edit',
            formMethod: 'PUT',
            formAction: res.locals.apiUri.secure.person.base + req.params.id
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
        formAction: res.locals.apiUri.secure.person.base
    })
})

router.get('/:currPage?', auth.needsRole('ADMIN'), function(req, res, next){
    try {
        var apiUri = res.locals.apiUri.secure.persons.base
        if (hasVal(req.params.currPage))
            apiUri += req.params.currPage
        else
            apiUri += 1
        if (hasVal(req.query.q))
            apiUri += '?q=' + req.query.q

        request({"uri":apiUri, "headers":{"x-access-token":req.session.authToken}}, function (err, response) {
            if (err) {
                console.error(err)
                return next(err)
            }
            return res.render(res.locals.listView, {
                title: appDesc['pluralName'],
                user: req.user,
                data: JSON.parse(response.body).data
            })
        })
    } catch(err) {
        return next(err)
    }
})

module.exports = router
