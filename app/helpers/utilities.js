var moment = require('moment')
var exports = module.exports = {}


// 12 January, 2017
// "2014-09-08T08:02:17-05:00" (ISO 8601)
// global.modelPatternDate = "D MMMM, YYYY"
// global.modelPatternTime = "h:mm A"
exports.mergeDateTimeFull = function(dateString, datePattern, timeString, timePattern) {
    try {
        var newDate = moment(dateString, datePattern)
        var newTime = moment(timeString, timePattern)
        newDate.hour(newTime.hour())
        newDate.minute(newTime.minute())
        return newDate.format()
    } catch(e) {
        console.error(e)
        return null
    }
}

exports.mergeDateTime = function(dateString, timeString) {
     var tmp = this.mergeDateTimeFull(dateString, global.modelPatternDate, timeString, global.modelPatternTime)
     console.log('mergeDateTime')
     console.log(tmp)
     return tmp
}

exports.isJSON = function(jsonString) {
    try {
        JSON.parse(jsonString)
        return true
    } catch(e) {
        return false
    }
}

exports.arrNoDupe =function(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}