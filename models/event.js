var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var EventSchema = new Schema({
    name: String,
    description: String,
    schedules: [{
        type: Schema.Types.ObjectId, ref: 'ScheduleDate'
    }],
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    _address: { type: Schema.Types.ObjectId, ref: 'Address' }
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

EventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', EventSchema)