var express = require('express'),
  router = express.Router()

var Meal = require("../../models/meal")

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
                    { "_task.name": regex },
                    { "_task.description": regex },
                    { "_task.location": regex },
                    { "allergins": regex },
                    { "s_task.tartTime": regex },
                    { "_task.endTime": regex }
                ]
            }
        }
        var options = {
            sort: { updatedAt: -1 },
            populate: '_task._contact',
            lean: false, // False enables virtual params
            page: req.params.currPage,
            limit: req.app.locals.resultsPerPage
        }
        Meal.paginate(query, options, function(err, data) {
            if (err) {
                res.status(500).json({ "status" : 500, "message" : err.message })
            } else {
                res.status(200).json({ "status" : 200, "data" : data })
            }
        })
    } catch(err) {
        res.status(500).json({ "status" : 500, "message" : err.message })
    }
})

module.exports = router
