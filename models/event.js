var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var EventSchema = new Schema({
    name: String,
    description: String,
    schedule: [{
        type: Schema.Types.ObjectId, ref: 'ScheduleDate'
    }],
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    _address: { type: Schema.Types.ObjectId, ref: 'Address' }
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

module.exports = mongoose.model('Event', EventSchema)