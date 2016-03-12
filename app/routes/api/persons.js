var express = require('express'),
    router = express.Router(),
    Person = require("../../models/person")

function hasVal(variable){
    return (variable !== 'undefined' && variable)
}

/* GET Returns all item. */
router.get('/:currPage?', function(req, res, next) {
    req.params.currPage = hasVal(req.params.currPage) ? req.params.currPage : 1
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
            return next(err)
        }
        return res.status(200).json({ "status": "200", "data" : data })
    })
})

module.exports = router