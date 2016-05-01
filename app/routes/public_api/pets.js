var express = require('express'),
    router = express.Router(),
    Pet = require("../../models/pet")

/************************************************************
 * PUBLIC REST API
 ************************************************************/

/**
 * Get pet
 */
router.get('/:id', function(req, res, next) {
    console.log('Find pet : ' + req.params.id)
    Pet.findById(req.params.id, function(err, data) {
        if (err) {
            console.error("Could not find pet")
            console.error(err)
            return res.status(404).json({ "status": "404", "message": "Did not find pet", "error": err })
        }
        return res.status(200).json({ "status": "200", "data": data })
    })
})

/**
 * save/update pet
 */
router.post('/', function(req, res, next) {
    Pet.findById(req.body._id, function(err, data) {
        if (err) {
            console.error("Issue finding pet")
            return res.status(404).json({ "status": "404", "message": "Could not find pet", "error": err })
        } else if (!data) {
            console.log('Creating new pet')
            data = new Pet(req.body)
        }
        data.save(function(err, data) {
            console.log('Updating pet')
            if (err) {
                console.error("Could not save pet")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not save pet", "error": err })
            }
            return res.status(200).json({ "status": "200", "message": "Pet created", "data": data })
        })
    })
})

/**
 * Get pets by reservation
 */
router.get('/byReservation/:id', function(req, res, next) {
    Pet.find({ _reservation:req.params.id })
        .exec(function(err, data) {
            if (err) {
                console.error("Could not find pets")
                console.error(err)
                return res.status(500).json({ "status": "404", "message": "Did not find pets", "error": err })
            }
            return res.status(200).json({ "status": "200", "data": data })
        }
    )
})

/**
 * Delete pet
 */
// TODO Do transaction if something cannot be deleted.
/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Pet.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            console.error("Could not delete pet")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete pet", "error": err })
        }
        return next()
    })
})

module.exports = router
