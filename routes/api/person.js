var express = require('express')
var router = express.Router()

var mongoose = require('mongoose'),
    Person = require("../../models/person")

var URL_BASE = "/admin/persons"

/* LIST Returns all item. */
router.get('/', function(req, res, next) {
    Person.find()
        .populate('_address', '_emergencyContact')
        .exec(function(err, data) {
            if (err) {
                return next(err)
            } else {
                res.json(data)
            }
        }
    )
})

/* CREATE New item created. */
router.post('/', function(req, res, next) {
    var data = new Person({
        nickName: req.body.nickName,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        phone: req.body.phone,
        isChild: req.body.isChild,
        childAge: req.body.childAge,
        gearList: req.body.gearList,
        _address: mongoose.Types.ObjectId(req.body._address),
        _emergencyContact: mongoose.Types.ObjectId(req.body._emergencyContact)
    })
    data.save(function(err) {
        if (err) {
            return next(err)
        } else {
            // res.status(200).json({ success: 'Success' })
            res.redirect(URL_BASE + '/success/created/' + data._id)
        }
    })
})

/* EDIT Returns single item. */
router.get('/:id', function(req, res, next) {
    Person.findById(req.params.id)
        .populate('_address')
        .populate('_emergencyContact')
        .exec(function(err, data) {
        if (err) {
            return next(err)
        } else {
            console.log(data)
            res.json(data)
        }
    })
})

/* UPDATE Updates an item. */
router.put('/:id', function(req, res, next) {
    Person.findById(req.params.id)
        .update({$set:req.body}, function (err, data) {
            if (err) {
                return next(err)
            } else {
                res.redirect(URL_BASE + '/success/updated/' + req.params.id)
            }
        }
    )
})

/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Person.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            return next(err)
        } else {
            res.status(200).json({ success: 'Deleted' })
            // res.redirect(URL_BASE + '/success/deleted')
        }
    })
})

/* SEARCH Returns all item. */
router.get('/search/:q', function(req, res, next) {
    var regex = new RegExp(req.params.q, 'i');
    Person.find()
        .or({firstName: regex})
        .or({lastName: regex})
        .or({nickName: regex})
        .or({email: regex})
        .or({fullName: regex})
        .populate('_address', '_emergencyContact')
        .exec(function(err, results) {
            if (err) {
                return next(err)
            } else {
                res.json(results);
            }
        }
    )
})

module.exports = router
