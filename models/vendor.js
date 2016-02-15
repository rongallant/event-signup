var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var VendorSchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    companyWebsite: String,
    companyDetails: String
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

VendorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Vendor', VendorSchema)
