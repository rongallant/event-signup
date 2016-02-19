var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate')

var MealSchema = new Schema({

    name: { type: String },
    description: { type: String },
    location: { type: String },
    allergins: [{ type: String }],


    startTime: String,
    endTime: String,

    personsRequired: { type: Number },
    effort: { type: Number }, // Scale of 1-5
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' }

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

MealSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Meal', MealSchema)
