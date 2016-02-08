var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var MealSchema = new Schema({
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    location: { type: String },
    startTime: String,
    endTime: String,
    title: { type: String },
    description: { type: String },
    allergins: [{ type: String }],
    personsRequired: Number,
    effort: Number // Scale of 1-5
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

module.exports = mongoose.model('Meal', MealSchema)
