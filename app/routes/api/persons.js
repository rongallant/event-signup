var express = require('express')
var router = express.Router()

var Person = require("../../models/person")

var URL_BASE = "/admin/persons"

function hasVal(variable){
    return (typeof variable !== 'undefined')
}

/* GET Returns all item. */
router.get('/:currPage?', function(req, res, next) {
    console.log('req.params.currPage: ' + req.params.currPage)
    req.params.currPage = (typeof req.params.currPage !== 'undefined') ? req.params.currPage : 1
    var query = {}
    if (hasVal(req.query.q)) {
        var regex = new RegExp(req.query.q, 'i')
        query = {
            $or: [
                { "firstName": regex },
                { "lastName": regex },
                { "username": regex },
                { "email": regex },
                { "fullName": regex },
                { "endTime": regex }
            ]
        }
    }
    var options = {
        sort: { updatedAt: -1 },
        populate: 'address emergencyContact',
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Person.paginate(query, options, function(err, data) {
        if (err) {
            res.status(500).json({ "status": 500, "message" : err.message })
        } else {
            res.status(200).json({ "status": 200, "data" : data })
        }
    })
})

module.exports = router