var express = require('express'),
    router = express.Router(),
    auth = require("../../helpers/authorization"),
    Account = require("../../models/account"),
    Person = require("../../models/person")

// router.all(function(req, res, next){
//     if (req.body) {
//         if (!(req.body._vendor && req.body._vendor.companyName)) {
//             req.body._vendor = null
//         } else {
//             req.vendorObj = new Vendor({
//                 _contact: mongoose.Types.ObjectId(req.body.id),
//                 companyName: req.body._vendor.companyName,
//                 companyDetails: req.body._vendor.companyDetails,
//                 companyWebsite: req.body._vendor.companyWebsite
//             })
//         }
//     }
//     return next()
// })

/* CREATE New item created. */
router.post('/', auth.needsRole('admin'), function(req, res, next) {
    var newPerson = new Person({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        gender: req.body.gender,
        isChild: req.body.isChild,
        childAge: req.body.childAge,
        gearList: req.body.gearList,
        emergencyContact: req.body.emergencyContact,
        address: [req.body.address]
    })
    newPerson.save(function(err, data) {
        if (err) {
            console.error("Error saving person")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Error saving person", "error": JSON.stringify(err) })
        } else {
            return res.status(201).json({ "status": "201", "message": "Person saved", "data": data })
        }
    })
})

/* EDIT Returns single item. */
router.get('/:id', function(req, res, next) {
    Person.findById(req.params.id)
        .populate('address emergencyContact _vendor')
        .exec(function(err, data) {
        if (err) {
            console.error("Could not retrieve person")
            console.error(err)
            return res.status(400).json({ "status": "400", "message": "Could not retrieve person", "error": JSON.stringify(err) })
        } else {
            return res.status(200).json({ "status": "200", "message": "Found person", "data": data })
        }
    })
})

/* by username Returns single person. */
router.get('/username/:username', function(req, res, next) {
    Person.findOne({ 'username' : req.params.username })
        .populate('address emergencyContact _vendor')
        .exec(function(err, data) {
        if (err) {
            console.error("Could not retrieve person")
            console.error(err)
            return res.status(400).json({ "status": "400", "message": "Could not retrieve person", "error": JSON.stringify(err) })
        } else {
            return res.status(200).json({ "status": "200", "message": "Found person", "data": data })
        }
    })
})

/* UPDATE Updates an item. */
router.put('/',  auth.needsRole('ADMIN'), function(req, res, next) {
    Person.findByIdAndUpdate(req.body.id, { $set:req.body, upsert: true }, function (err, data) {
        if (err) {
            console.error("Could not update person")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not update person", "error": JSON.stringify(err) })
        } else {
            return res.status(201).json({ "status": "201", "message": "Person updated", "data" : {"id" : req.body.id} })
        }
    }
  )
})

// TODO Do transaction is something cannot be deleted.
/* DELETE Deletes an item. */
router.delete('/:id', function(req, res, next) {
    Person.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            console.error("Could not delete person")
            console.error(err)
            res.status(500).json({ "status": "500", "message": "Could not delete person", "error": JSON.stringify(err) })
        } else {
            return next()
        }
    })
}, function(req, res, next) {
    Account.findOneAndRemove({ _person : req.params.id }, function (err) {
        if (err) {
            console.error("Could not delete account")
            console.error(err)
            return res.status(500).json({ "status": "500", "message": "Could not delete account", "error": JSON.stringify(err) })
        } else {
            return res.status(204).json({ "status" : 204, "message" : "Successfully Deleted" })
        }
    })
})

module.exports = router
