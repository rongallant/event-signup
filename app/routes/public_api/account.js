var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    Account = require("../../models/account"),
    Person = require("../../models/person")

/************************************************************
 * PUBLIC REST API
 ************************************************************/

/**
 * User Login
 */
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.error("Could not log in")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not log in", "error": err })
        } else if (!user) {
            console.error('404: User not found')
            return res.status(404).json({ "status": "404", "message": "User not found" })
        }
        req.logIn(user, function(err) {
            if (err) {
                console.error("Could not log in")
                console.error(err)
                return res.status(401).json({ "status": "401", "message": "Could not log in", "error": err })
            }
            var payload = { encTokenData: {"username": user.username, "roles": user.roles } },
                options = { "expiresIn" : "24h" },
                token = jwt.sign(payload, res.app.get('authToken'), options)
            req.session.authToken = token
            return res.status(200).json({ "status": "200", "message": "You have logged in", "data": user, "token" : token })
        })
    })(req, res, next)
})

/* Register new user */
router.post('/', function(req, res, next) {
    // See if username is available then register it.
    try {
        var data = new Account({
            username: req.body.username,
            email: req.body.email,
            roles: ['USER', 'ADMIN']
        })
        Account.register(data, req.body.password, function(err, account) {
            if (err) {
                console.error("Could not create account")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not create account", "error": err })
            }
            data.save(function(err, data) {
                if (err) {
                    console.error("Could not create account")
                    console.error(err)
                    return res.status(500).json({ "status": "500", "message": "Could not create account", "error": err })
                }
                return res.status(201).json({ "status" : "201", "message" : "Registration Successfull", "data" : data })
            })
        })
    } catch (err) {
        console.error("Could not create account")
        console.error(err)
        return res.status(500).json({ "status": "500", "message": "Could not create account", "error": err })
    }
})

/* Complete Account */
router.put('/', function(req, res, next) {
    var newPerson = new Person(req.body._person)
    newPerson.save(function(err, data) {
        if (err) {
            console.error("500: Error saving person")
            console.error(err)
            return next(err)
        } else {
            console.error("Profile saved")
            req.newPersonProfileId = data._id
            return next()
        }
    })
},
function(req, res, next) {
     Account.findOne({username:req.user.username}, function (err, data) {
        if (err) {
            console.error("Could not add profile account")
            console.error(err)
            return res.status(501).json({ "status": "501", "message": "Could not update account", "error": err })
        }
        if (data) {
            data._person = mongoose.Types.ObjectId(req.newPersonProfileId)
            data.save(function (err, data) {
                if (err) {
                    console.error("Could not update account")
                    console.error(err)
                    return res.status(501).json({ "status": "501", "message": "Could not update account", "error": err })
                }
                console.log("Account updated")
                return res.status(201).json({ "status": "201", "message": "Account updated", "data": data })
            })
        } else {
            console.error("Account not found")
            res.status(404).json({ "status": "404", "message": "Account not found" })
        }
    })
})

/**
 * Get single account.
 */
router.get('/:id', function(req, res, next) {
    Account.findById(req.params.id)
        .populate('_person')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : "404", "message" : "Account not found", "error": err })
            }
            return res.status(200).json({ "status": "200", "message": "Found account","data" : data })
        }
    )
})

/* Get by username */
router.get('/:username', function(req, res, next) {
    console.log('\nGET /account/' + req.params.id)
    Account.findOne({ username:req.params.username })
        .populate('_person')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : "404", "message" : "Account not found", "error": err })
            }
            return res.status(200).json({ "status": "200", "message": "Found account", "data" : data })
        }
    )
})

/* Check if account has person associated.  Account incomplete. */
router.get('/hasprofile/:username', function(req, res, next) {
    Account.findOne({ username:req.params.username })
        .select("_person")
        .populate("_person")
        .exec(function(err, data) {
            if (err) {
                console.error("Could not look up account profile")
                console.error(err)
                return res.send(false)
            }
            if (data && data._person) {
                return res.send(true)
            }
            console.log('Profile not found')
            return res.send(false)
        }
    )
})

module.exports = router
