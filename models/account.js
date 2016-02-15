'use strict'

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var AccountSchema = new Schema({
    email: { type: String, index: { unique: true } }, //  Use as username
    _person: { type: Schema.Types.ObjectId, ref: 'Person' },
})

AccountSchema.plugin(passportLocalMongoose)

AccountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Account', AccountSchema)
