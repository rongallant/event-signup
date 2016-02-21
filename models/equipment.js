var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var EquipmentSchema = new Schema({

    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    // Equipment that is being brought for community use (not just for yourself):
    // Equipment:
    // amountNeeded:
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
