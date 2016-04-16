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
                { "startDateTime": regex }
            ]
        }
    }
    var options = {
        sort: { active: -1, updatedAt: -1 },
        populate: '_contact',
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Event.paginate(query, options, function(err, data) {
        if (err) {
            return res.status(500).json({ "status": "500", "message": "Could not retrieve events", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": "List of events", "data": data })
    })
})

// Set current event to active and set all other to inactive.
router.put('/disableOthers/:currEventId', function(req, res, next) {
    Event.update({ "active": true, _id: { $ne: req.params.currEventId } }, { $set: { "active": false } }, function(err, data) {
        if (err) {
            console.error("Problem setting current event active")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Problem setting other events to non-active", "error": err })
        }
        return next()
    })
},
function(req, res, next) {
    Event.update({ _id: req.params.currEventId }, { $set: { "active": true } }, function(err, data) {
        if (err) {
            console.error("Problem setting current event active")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Problem setting current event active", "error": err })
        }
        return res.status(201).json({ "status" : "201", "message" : "Event is now the current event" })
    })
})

module.exports = router
