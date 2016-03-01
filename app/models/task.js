var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var TaskSchema = new Schema({
    name: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 2000 },
    startTime: String,
    endTime: String,
    location: { type: String },
    effort: Number, // Scale of 1-5
    personsRequired: Number,
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' }
}, {
    strict: true,
    // timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', TaskSchema)