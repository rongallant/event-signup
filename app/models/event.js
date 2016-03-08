var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Address = require('./address'),
    mongoosePaginate = require('mongoose-paginate'),
    moment = require('moment')

var EventSchema = new Schema({
    name: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 2000 },
    startDateTime: { type: Date },
    endDateTime: { type: Date },
    address: { type: Address.schema },
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

function timeToDate(strTime, currDateTime) {
    var dateTimeStr = moment(currDateTime).format(global.viewPatternDate) + ' ' + strTime
    return moment(dateTimeStr, global.viewPatternDate + ' ' + global.viewPatternTime).format()
}

function stringToDate (strDate, currDateTime) {
    var newDate = strDate + ' ' + moment(currDateTime).format(global.viewPatternTime)
    return moment(newDate, global.viewPatternDate + ' ' + global.viewPatternTime).format()
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