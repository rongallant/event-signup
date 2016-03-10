var express = require('express'),
    router = express.Router(),
    Task = require("../../models/task")

/************************************************************
 * REST API
 ************************************************************/

function hasVal(variable){
    return (typeof variable !== 'undefined')
}

/* GET Returns all item. */
router.get('/:currPage?', function(req, res, next) {
    req.params.currPage = (typeof req.params.currPage !== 'undefined') ? req.params.currPage : 1
    var query = {}
    if (hasVal(req.query.q)) {
        var regex = new RegExp(req.query.q, 'i')
        query = {
            $or: [
                { "name": regex },
                { "description": regex },
                { "location": regex },
                { "startTime": regex },
                { "endTime": regex }
            ]
        }
    }
    var options = {
        sort: { updatedAt: -1 },
        populate: '_contact',
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Task.paginate(query, options, function(err, data) {
        if (err) {
            console.error(err)
            return res.status(500).json({ "status" : 500, "message" : err.message })
        }
        res.status(200).json({ "status" : 200, "data" : {"id" : req.body.id} })
    })
})

module.exports = router
