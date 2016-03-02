var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    teamName: String,
    arrivingDate: Date,
    additionalInformation: String,

    _event: { type: Schema.Types.ObjectId, ref: 'Event' },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' }, // maybe Person

    guests: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]

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
