'use strict'

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema

var AccountSchema = new Schema({
    email: { type: String, index: { unique: true } }, //  Use as username
    _person: { type: Schema.Types.ObjectId, ref: 'Person' },
})

AccountSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', AccountSchema)
