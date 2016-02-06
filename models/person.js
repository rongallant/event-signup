var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var PersonSchema = new Schema({
    nickName: { type: String, required: true, index: { unique: true } },
    lastName: { type: String },
    firstName: { type: String },
    _address: { type: Schema.Types.ObjectId, ref: 'Address'  },
    phone: { type: Number },
    isChild: { type: Boolean },
    childAge: { type: Number },
    gearList: { type: String },
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