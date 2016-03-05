var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    teamName: String,
    arrivingDate: Date,
    additionalInformation: String,

    _event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person', required: true },

    guests: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
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
