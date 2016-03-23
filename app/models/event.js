var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    moment = require('moment'),
    Address = require('./address')

var EventSchema = new Schema({
    name: {
        type: String,
        maxlength: 70,
        required: true,
        index: {
            unique: true
        }
    },
    description: { type: String, maxlength: 2000 },
    startDateTime: { type: Date },
    endDateTime: { type: Date },
    address: { type: Address.schema }, // This embeded doc works
    _contact: { type: Schema.Types.ObjectId, ref: 'Person' },
    active: { type: Boolean, default: true }
}, {
    strict: true,
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

EventSchema.virtual('startDate')
    .get(function() {
        return moment(this.startDateTime).format(global.viewPatternDate)
    })
    .set(function(startDate) {
        this.set('startDateTime', stringToDate(startDate, this.startDateTime))
    }
)

EventSchema.virtual('startTime')
    .get(function() {
        return moment(this.startDateTime).format(global.viewPatternTime)
    })
    .set(function(startTimeTo) {
        this.set('startDateTime', timeToDate(startTimeTo, this.startDateTime))
    }
)

EventSchema.virtual('endDate')
    .get(function() {
        return moment(this.endDateTime).format(global.viewPatternDate)
    })
    .set(function(endDate) {
        this.set('endDateTime', stringToDate(endDate, this.endDateTime))
    }
)

EventSchema.virtual('endTime')
    .get(function() {
        return moment(this.endDateTime).format(global.viewPatternTime)
    })
    .set(function(endTimeTo) {
        this.set('endDateTime', timeToDate(endTimeTo, this.endDateTime))
    }
)

EventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', EventSchema)