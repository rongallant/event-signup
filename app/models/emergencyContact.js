var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var EmergencyContactSchema = new Schema({
    firstName: { type: String, maxlength: 35 },
    lastName: { type: String, maxlength: 35 },
    phone: { type: String, maxlength: 18 },
    email: { type: String, maxlength: 254 }
})

// Virtual Attibute 'fullName'
EmergencyContactSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema)
