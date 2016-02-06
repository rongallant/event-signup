var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var AddressSchema = new Schema({
    _mainPerson: { type: Schema.Types.ObjectId, ref: 'Person' },
    address1: String,
    address2: String,
    city: String,
    State: String,
    Country: String,
    postalCode: String,
    coordinates: String
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

module.exports = mongoose.model('Address', AddressSchema)