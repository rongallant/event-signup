
var express = require('express'),
    request = require('request'),
    path = require("path"),
    router = express.Router(),
    Person = require('../../models/person'),
    appSettings = require('../utils/appSettings'),
    authorization = require('../..//helpers/authorization.js'),
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

function hasVal(variable){
    return (typeof variable !== 'undefined')
}

router.get('/edit/:id', function(req, res, next) {
    request({"uri":res.locals.apiItem + req.params.id, "headers":{'x-access-token':req.session.authToken}}, function (err, data){
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
    try {
        var apiUri = res.locals.apiCollection
        if (hasVal(req.params.currPage))
            apiUri += req.params.currPage
        else
            apiUri += 1
        if (hasVal(req.query.q))
            apiUri += '?q=' + req.query.q

        console.log('\nSTART requesting persons')

        request({"uri":apiUri, "headers":{"x-access-token":req.session.authToken}}, function (err, data) {
            if (err) {
                console.log('ERR request({"uri":apiUri}' + err)
                console.log(data.body)
                return next(err)

            }
            authorization.apiRequestErrorHandler(req, res, data, next)

            res.render(res.locals.listView, {
                title: appDesc['pluralName'],
                user: req.user,
                data: JSON.parse(data.body).data
            })
        })

        console.log('\nEND requesting persons')


    } catch(err) {
        return next(err)
    }
})

module.exports = router
