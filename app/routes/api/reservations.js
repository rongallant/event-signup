var express = require('express'),
    router = express.Router()

var Reservation = require("../../models/reservation")

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
        sort: { updatedAt: -1 },
        populate: '_contact',
        lean: false, // False enables virtual params
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Reservation.paginate(query, options, function(err, data) {
        if (err) {
            return res.status(500).json({ "status": "500", "message": "Could not retrieve reservations", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": "List of reservations", "data": data })
    })
})

// Set current reservation to active and set all other to inactive.
router.put('/disableOthers/:id', function(req, res, next) {
    Reservation.update({ "active": true, _id: { $ne: req.params.id } }, { $set: { "active": false } }, function(err, data) {
        if (err) {
            console.error("Problem setting current reservation")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Problem setting other reservation to non-active", "error": err })
        }
        return next()
    })
},
function(req, res, next) {
    Reservation.update({ _id: req.params.id }, { $set: { "active": true } }, function(err, data) {
        if (err) {
            console.error("Problem setting current reservation active")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Problem setting current reservation active", "error": err })
        }
        return res.status(201).json({ "status" : "201", "message" : "Reservation is now the current reservation" })
    })
})

module.exports = router
