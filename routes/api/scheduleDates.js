var express = require('express'),
    router = express.Router()

var ScheduleDate = require("../../models/scheduleDate")
var URL_BASE = "/admin/scheduleDates"

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
                { "scheduleDay": regex },
                { "startTime": regex },
                { "endTime": regex }
            ]
        }
    }
    var options = {
        sort: { scheduleDay: -1 },
        populate: '_address',
        lean: false,
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    ScheduleDate.paginate(query, options, function(err, data) {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.status(200).json(data)
        }
    })
})

module.exports = router
