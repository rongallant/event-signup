require("./vendor")
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    Address = require("./address").schema,
    EmergencyContact = require("./emergencyContact").schema

var PersonSchema = new Schema({
    firstName: { type: String, maxlength: 35 },
    lastName: { type: String, maxlength: 35 },
    phone: { type: String, maxlength: 18 },
    gender: { type: String, maxlength: 5 },
    isChild: { type: Boolean },
    childAge: { type: Number, min: 0, max: 17 },
    gearList: { type: String, maxlength: 2000 },
    emergencyContact: { 
        firstName: { type: String, maxlength: 35 },
        lastName: { type: String, maxlength: 35 },
        phone: { type: String, maxlength: 18 },
        email: { type: String, maxlength: 254 }
    },
    address: [ Address ]
    
    // Proposed new fields
    // _vendor: { type: Schema.Types.ObjectId, ref: 'Vendor'  }
    // _reservation: { type: Schema.Types.ObjectId, ref: 'Reservation'  }
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
