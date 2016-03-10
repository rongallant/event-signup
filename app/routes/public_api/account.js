var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    Account = require("../../models/account"),
    URL_BASE = "/account"

/************************************************************
 * REST API
 ************************************************************/

router.post('/login', function(req, res, next) {
    console.log('\n/login call')
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.error('500: ', err.message)
            return res.status(500).json({ "status" : 500, "message" : err.message })
        } else if (!user) {
            console.error('404: User not found')
            return res.status(404).json({ "status" : 404, "message" : "User not found" })
        }
        req.logIn(user, function(err) {
            if (err) {
                console.error('401: ', err.message)
                return res.status(401).json({ "status" : 401, "message" : err.message })
            }
            var token = jwt.sign(user.username, res.app.get('authToken'), {
                expiresIn : "24 hours" // expires in 24 hours
            })
            req.session.authToken = token
            console.error('200: ', 'You have logged in. token =  ' + token)
            return res.status(200).json({ "status" : 200, message: 'You have logged in', "data" : user, "token" : token })
        })
    })(req, res, next)
})

/* REGISTER NEW USER */
router.post('/', function(req, res, next) {
    // See if username is available then register it.
    try {
        console.table(req.body)
        var data = new Account({
            username: req.body.username,
            email: req.body.email,
            roles: ['USER']
        })
        Account.register(data, req.body.password, function(err, account) {
            if (err) {
                console.error(err)
                return res.status(500).json({ "status" : 500, "message" : err.message })
            }
            data.save(function(err, data) {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ "status" : 500, "message" : err.message })
                }
                return res.status(201).json({ "status" : 201, "message" : "Registration Successfull", "data" : data })
            })
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ "status" : 500, "message" : err.message })
    }
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    Account.findById(req.params.id)
        .select('username email')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : 404, "message" : err.message })
            }
            return res.status(200).json({ "status" : 200, "data" : data })
        }
    )
})

/* PUT Updates an item. */
router.put('/', function(req, res, next) {
    Account.findByIdAndUpdate(req.body.id, {$set:req.body}, function (err, data) {
        if (err) {
            return res.status(501).json({ "status" : 501, "message" : err.message })
        }
        return res.status(201).json({ "status" : 201, "message" : "User Found", "data" : {"id" : req.body.id} })
    })
})

module.exports = router
