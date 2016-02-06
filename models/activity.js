var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var ActivitySchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    location: { type: String },
    startTime: String,
    endTime: String,
    title: { type: String },
    description: { type: String }
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

module.exports = mongoose.model('Activity', ActivitySchema)