var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var ScheduleDateSchema = new Schema({
    _address: { type: Schema.Types.ObjectId, ref: 'Address' },
   scheduleDay: { type: String },
   startTime: { type: String },
   endTime: { type: String }
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

module.exports = mongoose.model('ScheduleDate', ScheduleDateSchema)
