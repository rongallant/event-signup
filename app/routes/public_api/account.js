var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    Account = require("../../models/account"),
    Person = require("../../models/person")

/************************************************************
 * REST API
 ************************************************************/

router.post('/login', function(req, res, next) {
    console.log('\nGET /account/login/')
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not log in", "error": JSON.stringify(err) })
        } else if (!user) {
            console.error('404: User not found')
            return res.status(404).json({ "status" : "404", "message" : "User not found" })
        }
        req.logIn(user, function(err) {
            if (err) {
                console.error(err)
                return res.status(401).json({ "status": "401", "message": "Could not log in", "error": JSON.stringify(err) })
            }
            var payload = { encTokenData: {"username" : user.username, "roles" : user.roles } },
                options = { "expiresIn" : "2h" },
                token = jwt.sign(payload, res.app.get('authToken'), options)
            req.session.authToken = token
            console.log('200: ', 'You have logged in.') // Debug
            return res.status(200).json({ "status": "200", "message": "You have logged in", "data": user, "token" : token })
        })
    })(req, res, next)
})

/* REGISTER NEW USER */
router.post('/', function(req, res, next) {
    console.log('\nPOST /account/')
    // See if username is available then register it.
    try {
        var data = new Account({
            username: req.body.username,
            email: req.body.email
        })
        Account.register(data, req.body.password, function(err, account) {
            if (err) {
                console.error("REGISTER: " + err)
                return res.status(500).json({ "status": "500", "message": "Could not create account", "error": JSON.stringify(err) })
            }
            data.save(function(err, data) {
                if (err) {
                    console.error("SAVE: " + err)
                    return res.status(500).json({ "status": "500", "message": "Could not create account", "error": JSON.stringify(err) })
                }
                return res.status(201).json({ "status" : "201", "message" : "Registration Successfull", "data" : data })
            })
        })
    } catch (err) {
        console.error("CATCH: " + err)
        return res.status(500).json({ "status": "500", "message": "Could not create account", "error": JSON.stringify(err) })
    }
})

/* GET Returns single item. */
router.get('/:id', function(req, res, next) {
    console.log('\nGET /account/' + req.params.id)
    Account.findById(req.params.id)
        .populate('_person')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : "404", "message" : "Account not found", "error": JSON.stringify(err) })
            }
            return res.status(200).json({ "status": "200", "message": "Found account","data" : data })
        }
    )
})

/* GET by username */
router.get('/:username', function(req, res, next) {
    console.log('\nGET /account/' + req.params.id)
    Account.findOne({ username:req.params.username })
        .populate('_person')
        .exec(function(err, data) {
            if (err) {
                return res.status(404).json({ "status" : "404", "message" : "Account not found", "error": JSON.stringify(err) })
            }
            return res.status(200).json({ "status": "200", "message": "Found account", "data" : data })
        }
    )
})

/* Check if account has person associated.  Account incomplete. */
router.get('/hasprofile/:username', function(req, res, next) {
    console.log('\nGET /account/' + req.params.id)
    Account.findOne({ username:req.params.username })
        .select('_person._id')
        .exec(function(err, data) {
            if (err) {
                console.error("Could not look up account profile")
                console.error(err)
                return res.status(500).json({ "status": "500", "message": "Could not look up account profile", "error": JSON.stringify(err) })
            }
            if (data) {
                console.log('Found profile for account')
                return res.send(data)
            }
            console.error('Could not find account')
            return res.status(404)
        }
    )
})

// Complete Account
router.put('/', function(req, res, next) {
    var newPerson = new Person(req.body._person)
    newPerson.save(function(err, data) {
        if (err) {
            console.error("500: Error saving person")
            console.error(err)
            return next(err)
        } else {
            req.newPersonProfileId = data._id
            return next()
        }
    })
},
function(req, res, next) {
     Account.findOne({username:req.user.username}, function (err, data) {
        if (err) {
            console.error(err)
            return res.status(501).json({ "status": "501", "message": "Could not update account", "error": JSON.stringify(err) })
        }
        if (data) {
            data._person = mongoose.Types.ObjectId(req.newPersonProfileId)
            data.save(function (err, data) {
                if (err) {
                    console.error(err)
                    return res.status(501).json({ "status": "501", "message": "Could not update account", "error": JSON.stringify(err) })
                }
                return res.status(201).json({ "status": "201", "message": "Account updated", "data": data })
            })
        } else {
            res.status(404).json({ "status": "404", "message": "Account not found" })
        }
    })
})

module.exports = router
