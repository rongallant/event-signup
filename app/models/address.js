var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    countries = require("i18n-iso-countries")

var AddressSchema = new Schema({
    name:  { type: String },
    description:  { type: String },
    address1:  { type: String },
    address2:  { type: String },
    city:  { type: String },
    state:  { type: String },
    postalCode:  { type: String, uppercase: true  },
    country:  { type: String, uppercase: true },
    location: { type: String }
}, {
    strict: true,
    timestamps: false,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

// Remove double spaces
function normalizeStr(str){
    return str.replace( /\s\s+/g, ' ' )
}

// Remove double spaces and replace with plus (+) for google map api urls.
function googleizeStr(str){
    return str.replace( /\s\s+/g, ' ' ).replace( /\s+/g, '+' )
}

// Formated Address
AddressSchema.virtual('fullAddress').get(function () {
    try {
        return (this.address1.length > 0 ? this.address1 + '\n' : '') +
            (this.address2.length > 0 ? this.address2 + '\n' : '') +
            (this.city.length > 0 ? this.city + ', ' : '') +
            (this.state.length > 0 ? this.state.toUpperCase() + '  ' : '') +
            (this.postalCode.length > 0 ? this.postalCode + '\n' : '') +
            (this.country.length > 0 ? countries.getName(this.country.toUpperCase(), 'en') : '')
    } catch(err) {
        return ''
    }
})

// Formated Address
AddressSchema.virtual('shortAddress').get(function () {
    try {
        return (this.address1.length > 0 ? this.address1 : '') +
            (this.city.length > 0 ?  ', ' + this.city : '') +
            (this.state.length > 0 ?  ', ' + this.state.toUpperCase() : '') +
            (this.postalCode.length > 0 ? ', ' + this.postalCode : '') +
            (this.country.length > 0 ? ', ' + countries.alpha2ToAlpha3(this.country.toUpperCase()) : '')
    } catch(err) {
        return ''
    }
})

// Formated Address
AddressSchema.virtual('delimitedAddress').get(function () {
    try {
        return (this.address1.length > 0 ? googleizeStr(this.address1) : '') +
            (this.city.length > 0 ?  ',' + googleizeStr(this.city) : '') +
            (this.state.length > 0 ?  ',' + this.state.toUpperCase() : '') +
            (this.postalCode.length > 0 ? ',' + this.postalCode : '') +
            (this.country.length > 0 ? ',' + countries.alpha2ToAlpha3(this.country.toUpperCase()) : '')
    } catch(err) {
        return ''
    }
})

module.exports = mongoose.model('Address', AddressSchema, 'Address')