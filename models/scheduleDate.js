var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var ScheduleDateSchema = new Schema({
   date: Date,
   startTime: String,
   endTime: String,
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

module.exports = mongoose.model('ScheduleDate', ScheduleDateSchema)