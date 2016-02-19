var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    teamName: String,

    _event: { type: Schema.Types.ObjectId, ref: 'Event' },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' }, // maybe Person
    _guests: { type: Schema.Types.ObjectId, ref: 'Guest' },
    _pet: { type: Schema.Types.ObjectId, ref: 'Pet' },

    arrivingDate: Date,
    additionalInformation: String,
    daysAttending: [{ type: Schema.Types.ObjectId, ref: 'ScheduleDate' }],
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

ReservationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Reservation', ReservationSchema)
