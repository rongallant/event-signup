var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var GuestSchema = new Schema({
    arrivingDate: Date,
    departingDate: Date,
    additionalInformation: String,

    daysAttending: [{
        type: Schema.Types.ObjectId, ref: 'ScheduleDate'
    }],

    _person: { type: Schema.Types.ObjectId, ref: 'Person' },
    _reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
    _activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    _tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    _meals: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
    _pet: { type: Schema.Types.ObjectId, ref: 'Pet' }

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

GuestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Guest', GuestSchema)
