var express = require('express'),
    router = express.Router(),
    Guest = require("../../models/guest")

/************************************************************
 * PUBLIC REST API
 ************************************************************/

/**
 * Get guest
 */
router.get('/:id', function(req, res, next) {
    Guest.findById(req.params.id, function(err, data) {
        if (err) {
            console.error("Could not find guest")
            console.error(err)
            return res.status(404).json({ "status": "404", "message": "Did not find guest", "error": err })
        }
        return res.status(200).json({ "status": "200", "data": data })
    })
})

/**
 * save/update guest
 */
router.post('/', function(req, res, next) {
    Guest.findById(req.body._id, function(err, data) {
        if (err) {
            console.error("Issue finding guest")
            return res.status(404).json({ "status": "404", "message": "Could not find guest", "error": err })
        } else if (!data) { data = new 
            console.log('Creating new guest')
            data = new Guest(req.body)
        }
        data.save(function(err, data) {
            if (err) {
                console.error("Could not save guest")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not save guest", "error": err })
            }
            return res.status(200).json({ "status": "200", "message": "Guest created", "data": data })
        })
    })
})

/**
 * Get guests by reservation
 */
router.get('/byReservation/:id', function(req, res, next) {
    Guest.find({ _reservation:req.params.id })
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find guests")
                console.error(err)
                return res.status(500).json({ "status": "404", "message": "Did not find guests", "error": err })
            }
            return res.status(200).json({ "status": "200", "data": data })
        }
    )
})

/**
 * Delete guest
 */
/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Guest.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            console.error("Could not delete guest")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete guest", "error": err })
        }
        return res.status(200).json({ "status": "200", "message": "Deleted Successfully" })
    })
})

module.exports = router
