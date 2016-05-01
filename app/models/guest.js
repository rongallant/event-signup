var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var GuestSchema = new Schema({
    _reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    firstName: {
        type: String,
        maxlength: 35
    },
    lastName: {
        type: String,
        maxlength: 35
    },
    email: {
        type: String,
        maxlength: 255
    },
    phone: {
        type: String,
        maxlength: 15
    }
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

// Virtual Attibute 'fullName'
GuestSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('Guest', GuestSchema)
