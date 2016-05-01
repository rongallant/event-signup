var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    mongoosePaginate = require('mongoose-paginate')

var ActivitySchema = new Schema({
    _event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person', required: true  },
    name: { type: String, maxlength: 70, required: true },
    description: { type: String, maxlength: 2000 },
    startDateTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    location: { type: String }
}, {
    strict: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

ActivitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Activity', ActivitySchema)