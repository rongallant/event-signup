var express = require('express'),
    router = express.Router()

var Event = require("../../models/event")

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
                { "startDateTime": regex },
                { "endDateTime": regex }
            ]
        }
    }
    var options = {
        sort: { updatedAt: -1 },
        populate: '_contact _address ',
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Event.paginate(query, options, function(err, data) {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.status(200).json(data)
        }
    })
})

module.exports = router
