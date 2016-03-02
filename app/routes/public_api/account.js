var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Person = require("../../models/person"),
    URL_BASE = "/account"

/************************************************************
 * REST API
 ************************************************************/

router.post('/login', function(req, res, next) {
    console.log('Trying to logIn')
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.status(500).json({ "status" : "error", "error" : err.message })
        } else if (!user) {
            res.status(404).json({ "status" : "error", "error" : "User not found" })
        } else {
            req.logIn(user, function(err) {
                if (err) {
                    console.error(err)
                    res.status(500).json({ "status" : "error", "error" : err.message })
                } else {
                    res.status(200).json({ "status" : "success" })
                }
            })
        }
    })(req, res, next)
})

/* REGISTER NEW USER */
router.post('/', function(req, res, next) {
    // See if username is available then register it.
    try {
        console.log('Register New User')
        console.table(req.body)
        var data = new Person({
            username: req.body.username,
            email: req.body.email,
            roles: []
        })
        Person.register(data, req.body.password, function(err, account) {
            if (err) {
                console.error(err)
                res.status(500).json({ "status" : "error", "error" : err.message })
            } else {
                data.save(function(err, data) {
                    if (err) {
                        console.error(err)
                        res.status(500).json({ "status" : "error", "error" : err.message })
                    } else {
                        res.status(201).json({ "status" : "success", data })
                    }
                })
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ "status" : "error", "error" : err.message })
    }
})


/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Person.findById(req.params.id)
        .select('username email')
        .exec(function(err, data) {
            if (err) {
                res.status(404).json({ "status" : "error", "error" : err.message })
            } else {
                res.status(200).json({ "status" : "success", data })
            }
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Person.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            res.status(501).json({ "status" : "error", "error" : err.message })
        } else {
            res.status(201).json({ "status" : "success", "data" : {"id" : req.body.id} })
        }
    })
})

module.exports = router
