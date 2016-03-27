var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

// Equipment that is being brought for community use (not just for yourself):
var EquipmentSchema = new Schema({
    _event: { type: Schema.Types.ObjectId, ref: 'Event' },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    name: String,
    description: String,
    quantity: String
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

EquipmentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Equipment', EquipmentSchema)
