var async = require("async"),
    moment = require("moment"),
    Activity = require("../../models/activity"),
    Task = require("../../models/task"),
    Meal = require("../../models/meal")


var scheduleForDay = function (userInput, callback) {

    console.log(userInput)

    var start = moment(userInput.eventDay).startOf('day'),
        end = moment(userInput.eventDay).endOf('day'),
        query = { _event:userInput.eventId, startDateTime: { "$gte": start, "$lt": end }}

    async.parallel({
        modelAFind: function(cb) {
            Activity.find(query)
                .select("_contact name description startDateTime duration")
                .populate("_contact")
                .exec(cb)
        },
        modelBFind: function(cb) {
            modelAFind: Task.find(query)
                .select("_contact name description startDateTime duration")
                .populate("_contact")
                .exec(cb)
        },
        modelCFind: function(cb) {
            Meal.find(query)
                .select("_contact name description startDateTime duration")
                .populate("_contact")
                .exec(cb)
        }
    }, function(err, result) {

        console.log(result.modelAResult)
        console.log(result.modelBResult)
        console.log(result.modelCResult)

        var ret = result.modelAFind;
        ret.dataB = result.modelBFind;
        ret.dataC = result.modelCFind;
        callback(err, ret);
  })
}
