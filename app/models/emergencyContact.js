var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var EmergencyContactSchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    firstName: { type: String, maxlength: 35 },
    lastName: { type: String, maxlength: 35 },
    phone: { type: String, maxlength: 18 },
    email: { type: String, maxlength: 254 }
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

// Virtual Attibute 'fullName'
EmergencyContactSchema.virtual('fullName')
    .get(function () {
        return this.firstName ? this.firstName : '' + ' ' + this.lastName ? this.lastName : ''
    })
    .set(function(fullNameTo) {
        if (fullNameTo) {
            var fn = fullNameTo.split(' ')
            this.set('firstName', fn[0])
            this.set('lastName', fn[fn.length - 1])
        }
    }
)

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema)
