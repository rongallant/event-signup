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
    req.params.currPage = (typeof req.params.currPage !== 'undefined') ? req.params.currPage : 1
    var query = {}
    if (hasVal(req.query.q)) {
        var regex = new RegExp(req.query.q, 'i')
        query = {
            $or: [
                { "name": regex },
                { "description": regex },
                { "startTime": regex },
                { "endTime": regex }
            ]
        }
    }
    var options = {
        select: 'name startTime endTime _contact',
        sort: { updatedAt: -1 },
        populate: '_contact',
        lean: false,
        page: req.params.currPage,
        limit: req.app.locals.resultsPerPage
    }
    Activity.paginate(query, options, function(err, data) {
            if (err) {
                res.status(500).json({ error: err.message })
            } else {
                res.status(200).json(data)
            }
        })
})

module.exports = router
