var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var AddressSchema = new Schema({
    _mainPerson: { type: Schema.Types.ObjectId, ref: 'Person' },
    address1: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    location: { type: String }
}, {
    strict: true,
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

// Formated Address
AddressSchema.virtual('fullAddress').get(function () {
    try {
        return (this.address1.length > 0 ? this.address1 + '\n' : '') +
            (this.address2.length > 0 ? this.address2 + '\n' : '') +
            (this.city.length > 0 ? this.city + ', ' : '') +
            (this.state.length > 0 ? this.state + '  ' : '') +
            (this.postalCode.length > 0 ? this.postalCode + '\n' : '') +
            (this.country.length > 0 ? this.country : '')
    } catch(err) {
        return ''
    }
})

module.exports = mongoose.model('Address', AddressSchema)