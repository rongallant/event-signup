var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    utils = require('../../helpers/utilities'),
    Meal = require("../../models/meal")

var URL_BASE = "/admin/meals"

/************************************************************
 * REST API
 ************************************************************/

router.get('/:id', function(req, res, next) {
    var populate = !req.query.simple ? '' : '_contact'
    Meal.findById(req.params.id)
        .populate(populate)
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find meal")
                console.error(err)
                return res.status(404).json({ "status": "404", "message": "Could not find meal", "error": err })
            }
            return res.status(200).json({ "status": "200", "data" : data })
        }
    )
})

/* POST New item created. */
router.post('/', function(req, res, next) {
    console.error("Create meal")
    Meal.create(req.body, function(err, data) {
        if (err) {
            console.error("Issue creating meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not create meal", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": 'Meal created', "data": data })
    })
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {

    console.log('req.body')
    console.log(req.body)

    Meal.update({_id:req.body.id}, {$set:req.body}, function (err, data) {
        console.error("Update meal")
        if (err) {
            console.error("Error updating meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not update meal", "error": err })
        } else if (data && data.nModified === 0) {
            console.log("Could not update meal")
            console.log(data)
            return res.status(500).json({ "status": "500", "message": "Could not update meal" })
        }
        console.log('data')
        console.log(data)
        return res.status(200).json({ "status": "200", "message": "Meal updated", "data": {"id": req.body.id} })
    })
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Meal.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.error("Could not delete meal")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete meal", "error": err })
        } else if (data === null) {
            return res.status(404).json({ "status": "404", "message": "Meal not found" })
        }
        return res.status(200).json({ "status": "200", "message": "Deleted Successfully" })
    })
})

module.exports = router
