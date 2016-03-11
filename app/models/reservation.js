var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Pet = require('./pet'),
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    arrivingDate: Date,
    additionalInformation: String,
    guests: [{
        firstName: {
            type: String,
            maxlength: 35
        },
        lastName: {
            type: String,
            maxlength: 35
        }
    }],
    pets: [ Pet.schema ],

    _contact: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    _event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },

    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', limit: 10 }],
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity', limit: 10 }]
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
