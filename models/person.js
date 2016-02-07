var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var PersonSchema = new Schema({
    nickName: { type: String, maxlength: 70, index: { unique: true }, required: true },
    lastName: { type: String, maxlength: 35, required: true },
    firstName: { type: String, maxlength: 35, required: true },
    email: { type: String, maxlength: 254, required: true },
    phone: { type: String, maxlength: 18 },
    isChild: { type: Boolean },
    childAge: { type: Number, min: 0, max: 17 },
    gearList: { type: String, maxlength: 2000 },
    _address: { type: Schema.Types.ObjectId, ref: 'Address'  },
    _emergencyContact: { type: Schema.Types.ObjectId, ref: 'Person'  }
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

// Virtual Attibute "fullName"
PersonSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('Person', PersonSchema)
