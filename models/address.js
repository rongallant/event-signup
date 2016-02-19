var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var AddressSchema = new Schema({
    name:  { type: String },
    description:  { type: String },
    address1:  { type: String },
    address2:  { type: String },
    city:  { type: String },
    state:  { type: String },
    country:  { type: String },
    postalCode:  { type: String },
    location: { type: String },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' }
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

AddressSchema.plugin(mongoosePaginate);

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
        console.log(err)
        return 'ERR'
    }
})

// Formated Address
AddressSchema.virtual('shortAddress').get(function () {
    try {
        return (this.address1.length > 0 ? this.address1 : '') +
            (this.city.length > 0 ?  ', ' + this.city : '') +
            (this.state.length > 0 ?  ', ' + this.state : '') +
            (this.postalCode.length > 0 ? ', ' + this.postalCode : '')
    } catch(err) {
        console.log(err)
        return 'ERR'
    }
})

module.exports = mongoose.model('Address', AddressSchema, 'Address')