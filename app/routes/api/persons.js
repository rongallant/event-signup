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
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Person.paginate(query, options, function(err, data) {
        if (err) {
            console.error("Could not retrieve list of people.")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not retrieve list of people.", "error": JSON.stringify(err) })
        }
        return res.status(200).json({ "status": "200", "message": "Returned results",  "data" : data })
    })
})

module.exports = router