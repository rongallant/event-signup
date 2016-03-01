var express = require('express'),
  router = express.Router()

var Pet = require("../../models/pet")
var URL_BASE = "/admin/pets"

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
                { "petName": regex },
                { "petType": regex },
                { "petWeight": regex }
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
    Pet.paginate(query, options, function(err, data) {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.status(200).json(data)
        }
    })
})

module.exports = router
