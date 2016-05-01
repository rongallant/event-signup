var express = require('express'),
    router = express.Router(),
    Guest = require("../../models/guest")

/************************************************************
 * PUBLIC REST API
 ************************************************************/

/**
 * Get guest
 */


/**
 * Get guest by reservation
 */
router.get('/:id', function(req, res, next) {
    console.log('Find guest : ' + req.params.id)
    Guest.findById(req.params.id, function(err, data) {
        if (err) {
            console.error("Could not find guest")
            console.error(err)
            return res.status(404).json({ "status": "404", "message": "Did not find guest", "error": err })
        }
        return res.status(200).json({ "status": "200", "data": data })
    })
})

router.put()

module.exports = router
