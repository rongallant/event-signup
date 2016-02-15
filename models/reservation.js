var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    teamName: String,
    _contact: { type: Schema.Types.ObjectId, ref: 'Guest' }, // maybe Person
    _guests: { type: Schema.Types.ObjectId, ref: 'Guest' },
    arrivingDate: Date,
    additionalInformation: String,
    daysAttending: [{
        type: Schema.Types.ObjectId, ref: 'ScheduleDate'
    }],
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

ReservationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Reservation', ReservationSchema)
