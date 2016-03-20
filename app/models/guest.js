var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var GuestSchema = new Schema({
    firstName: {
        type: String,
        maxlength: 35
    },
    lastName: {
        type: String,
        maxlength: 35
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

module.exports = mongoose.model('Guest', GuestSchema)
