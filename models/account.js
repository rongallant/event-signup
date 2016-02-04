'use strict'

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    Email = require('./email').schema

var AccountSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    displayName: { type: String }, // The name of this user, suitable for display.
    name: {
        familyName: { type: String }, // The family name of this user, or "last name" in most Western languages.
        givenName: { type: String }, // The given name of this user, or "first name" in most Western languages.
        middleName: { type: String } // The middle name of this user.
    },
    emails: [ Email ],
    photos: [
        { value: { type: String } } // The URL of the image.
    ]
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

// Virtual Attibute "fullName"
AccountSchema.virtual('name.fullName').get(function () {
    return this.name.familyName + ' ' + this.name.givenName
})

AccountSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', AccountSchema)
