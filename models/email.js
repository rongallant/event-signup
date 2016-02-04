var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Email = new Schema({
    'value': { type: String }, // The actual email address.
    'type': { type: String } // The type of email address (home, work, etc.).
},
{
    strict: true
})

module.exports = mongoose.model('Email', Email)