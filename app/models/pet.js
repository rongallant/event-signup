var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var PetSchema = new Schema({
    _reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    petName: String,
    petWeight: String,
    petType: { type: String, default: 'Dog' } // TODO make enum
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

module.exports = mongoose.model('Pet', PetSchema)
