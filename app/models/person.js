var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    Address = require("./address"),
    EmergencyContact = require("./emergencyContact")

var PersonSchema = new Schema({
    firstName: { type: String, maxlength: 35 },
    lastName: { type: String, maxlength: 35 },
    phone: { type: String, maxlength: 18 },
    gender: { type: String, maxlength: 5 },
    isChild: { type: Boolean },
    childAge: { type: Number, min: 0, max: 17 },
    gearList: { type: String, maxlength: 2000 },

    emergencyContact: { type: EmergencyContact.schema  },
    address: { type: Address.schema  },
    _vendor: { type: Schema.Types.ObjectId, ref: 'Vendor'  },

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

PersonSchema.plugin(mongoosePaginate);

// Virtual Attibute 'fullName'
PersonSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('Person', PersonSchema)
