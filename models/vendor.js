var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var VendorSchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    companyWebsite: String,
    companyDetails: String
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

module.exports = mongoose.model('Vendor', VendorSchema)
