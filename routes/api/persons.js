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
                { "nickName": regex },
                { "email": regex },
                { "fullName": regex },
                { "nickName": regex },
                { "endTime": regex }
            ]
        }
    }
    var options = {
        sort: { updatedAt: -1 },
        populate: '_address _emergencyContact',
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Person.paginate(query, options, function(err, data) {
        if (err) {
            res.status(500).json({ "status": "error", "error": err })
        } else {
            res.status(200).json({ "status": "success", data })
        }
    })
})

module.exports = router
//  "status": "error",
//   "error": {
//     "name": "MongoError",
//     "message": "Can't canonicalize query: BadValue bad skip value in query",
//     "$err": "Can't canonicalize query: BadValue bad skip value in query",
//     "code": 17287
//   }