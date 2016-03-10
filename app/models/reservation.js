var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Person = require("./person"),
    Pet = require('./pet'),
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    _contact: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true

    },
    _event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    teamName: String,
    arrivingDate: Date,
    additionalInformation: String,

    guests: [{
        firstName: {
            type: String,
            maxlength: 35,
            required: true
        },
        lastName: {
            type: String,
            maxlength: 35,
            required: true
        }
    }],
    pets: [ Pet.schema ],

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
