var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var ActivitySchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    name: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 2000 },
    startTime: String,
    endTime: String
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

ActivitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Activity', ActivitySchema)