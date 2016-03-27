var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    mongoosePaginate = require('mongoose-paginate')

var ActivitySchema = new Schema({
    _event: { type: Schema.Types.ObjectId, ref: 'Event' },
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    name: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 2000 },
    startDateTime: { type: Date },
    endDateTime: { type: Date }
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

function timeToDate(strTime, currDateTime) {
    var result
    try {
        var dateTimeStr = moment(currDateTime).format(global.viewPatternDate) + ' ' + strTime
        result = moment(dateTimeStr, global.viewPatternDate + ' ' + global.viewPatternTime).format()
    } catch (e) {
        console.log(e)
    }
    return result
}

function stringToDate (strDate, currDateTime) {
    var result
    try {
        var newDate = strDate + ' ' + moment(currDateTime).format(global.viewPatternTime)
        result =  moment(newDate, global.viewPatternDate + ' ' + global.viewPatternTime).format()
    } catch (e) {
        console.log(e)
    }
    return result
}

ActivitySchema.virtual('startDate')
    .get(function() {
        return moment(this.startDateTime).format(global.viewPatternDate)
    })
    .set(function(startDate) {
        if (startDate) {
            this.set('startDateTime', stringToDate(startDate, this.startDateTime))
        }
    }
)

ActivitySchema.virtual('startTime')
    .get(function() {
        return moment(this.startDateTime).format(global.viewPatternTime)
    })
    .set(function(startTimeTo) {
        if (startTimeTo) {
            this.set('startDateTime', timeToDate(startTimeTo, this.startDateTime))
        }
    }
)

ActivitySchema.virtual('endDate')
    .get(function() {
        return moment(this.endDateTime).format(global.viewPatternDate)
    })
    .set(function(endDate) {
        if (endDate) {
            this.set('endDateTime', stringToDate(endDate, this.endDateTime))
        }
    }
)

ActivitySchema.virtual('endTime')
    .get(function() {
        return moment(this.endDateTime).format(global.viewPatternTime)
    })
    .set(function(endTimeTo) {
        if (endTimeTo) {
            this.set('endDateTime', timeToDate(endTimeTo, this.endDateTime))
        }
    }
)

ActivitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Activity', ActivitySchema)