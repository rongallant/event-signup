var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    ScheduleDateSchema = require("./scheduleDate").schema


var EventSchema = new Schema({
    name: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 2000 },
    schedules: [ ScheduleDateSchema ],
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