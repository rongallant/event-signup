var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var PetSchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    name: String,
    weight: String,
    animal: { type: String, default: 'Dog' }
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
