var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    Task = require("./task")

var MealSchema = new Schema({
    _task: { type: Task.schema, default: new Task() },
    allergins: [{ type: String }]

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
