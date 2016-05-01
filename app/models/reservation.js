var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Guest = require('./guest').schema,
    Pet = require('./pet').schema,
    mongoosePaginate = require('mongoose-paginate')

var ReservationSchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    _event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },

    arrivingDate: Date,
    additionalInformation: String,
    
    guests: [ Guest ],
    pets: [ Pet ],

    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', limit: 10 }],
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity', limit: 25 }],
    meals: [{ type: Schema.Types.ObjectId, ref: 'Meal', limit: 25 }]
}, {
    strict: false,
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
