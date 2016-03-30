var express = require('express'),
    router = express.Router()

var Activity = require("../../models/activity")
var URL_BASE = "/admin/activities"

/************************************************************
 * REST API
 ************************************************************/

function hasVal(variable){
    return (typeof variable !== 'undefined')
}


/* GET Returns all item. */
router.get('/:currPage?', function(req, res, next) {
    try {
        req.params.currPage = (typeof req.params.currPage !== 'undefined') ? req.params.currPage : 1
        var query = {}
        if (hasVal(req.query.q)) {
            var regex = new RegExp(req.query.q, 'i')
            query = {
                $or: [
                    { "name": regex },
                    { "description": regex },
                    { "startTime": regex }
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
    } catch(err) {
        return next(err)
    }
    Activity.paginate(query, options, function(err, data) {
        if (err) {
            return res.status(500).json({ "status": "500", "message": "Could not retrieve activities", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": "Retrieved activities", "data": data })
    })
})

/* GET Returns all activities by event ID. */
router.get('/byEvent/:eventId', function(req, res, next) {
    if (!req.params.eventId) {
        return res.status(404).json({ "status": "404", "message": "Event id not provided" })
    } else {
        Activity.find({ "_event": req.params.eventId }, function(err, data) {
            if (err) {
                return res.status(500).json({ "status": "500", "message": "Could not retrieve activities", "error": err })
            }
            return res.status(200).json({ "status": "200", "message": "Retrieved activities", "data": data })
        })
    }
})

/* GET Returns count of activities by event ID. */
router.get('/byEventCount/:eventId', function(req, res, next) {
    if (req.params.eventId) {
        Activity.find({ "_event": req.params.eventId }).count(function(err, count) {
            if (err) { return res.send(String(0)) }
            return res.send(String(count))
        })
    }
})

module.exports = router
