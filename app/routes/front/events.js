var async = require("async"),
    auth = require('../../helpers/authorization.js'),
    express = require("express"),
    request = require('request'),
    router = express.Router(),
    moment = require("moment"),
    mongoose = require("mongoose"),
    Account = require("../../models/account"),
    Activity = require("../../models/activity"),
    Task = require("../../models/task"),
    Meal = require("../../models/meal"),
    Pet = require("../../models/pet"),
    Guest = require("../../models/guest"),
    Event = require("../../models/event"),
    Reservation = require("../../models/reservation"),
    appSettings = require("../utils/appSettings"),
    appDesc = []

appDesc['apiSingle'] = '/reservation'
appDesc['folder'] = '/events'

router.use(function(req, res, next) {
    appSettings.appPaths(req, res, appDesc)
    next()
})

/************************************************************
 * VIEWS
 ************************************************************/

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

(function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
})();


function hasVal(varName) {
    return (varName !== undefined) && (varName !== null)  && varName
}

function hasNoVal(varName) {
    return !hasVal(varName)
}

// Get User ID
// TODO Move to API
function getPersonId(req, res, next) {
    Account.findOne({ "username" : req.user.username },  "_person", function(err, data){
        if (err) {
            console.error(err)
            return next(err)
        }
        req.personId = data._person
        return next()
    })
}

// Get Users Reservation
// TODO Move to API
function getUserReservation(req, res, next) {
    console.log({ "_contact" : mongoose.Types.ObjectId(req.personId) })
    Reservation.findOne({ "_contact" : mongoose.Types.ObjectId(req.personId) })
        .populate(' _contact _contact.emergencyContact _event' ) //  pets guests tasks activities meals
        .exec(function(err, data){
            if (err) {
                console.log('Issue finding users reservation')
                console.error(err.message)
                return next(err)
            } else if (hasNoVal(data)) {
                console.log('Could not find users reservation')
                return next()
            } else {
                console.log('Found Users Reservation')
                // console.log(data)
                req.reservation = data
                return next()
            }
        }
    )
}

// Get Event
// TODO Use API
function getCurrentEvent(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    Event.findOne({"active" : true})
        .sort({ 'createdAt' : -1 })
        .select("id")
        .exec(function(err, data) {
            if (err) {
                console.error(err.message)
                return next(err)
            } else if (hasNoVal(data)) {
                return res.render("message", {
                    title: "Event Signup",
                    user: req.user,
                    message: "No event was found. Please try again later."
                })
            }
            req.event = data
            return next()
        }
    )
}

// Create new reservation
// TODO Move to API
function createNewReservation(req, res, next) {
    if (hasVal(req.reservation)) { return next() }
    try {
        req.reservation = new Reservation({
            _contact: mongoose.Types.ObjectId(req.personId),
            _event: mongoose.Types.ObjectId(req.event.id),
            name: req.body.name,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        return next()
    } catch(err) {
        console.log("Error creating reservation")
        err = new Error("Error creating reservation")
        err.statusCode = 500
        return next(err)
    }
}

// VIEW Signup Page
router.get('/signup', getPersonId, getUserReservation, getCurrentEvent, createNewReservation, function(req, res, next) {
    res.render("front/events/signup", {
        title: "Event Signup",
        user: req.user,
        data: req.reservation,
        formMethod: 'POST',
        formAction: res.locals.apiUri.secure.reservation.base,
        formComplete: res.locals.pageAccountHome,
        moment: moment
    })
})


/** ****************************************************************************
 * Modal Forms
 **************************************************************************** */


/**
 * I am the EDIT modal field content for editing inline guests.
 */
router.get('/guest/modal', function(req, res, next) {
    res.render('front/events/parts/guestFormModal', {
        user: req.user,
        data: new Guest()
    })
})

/**
 * I am the EDIT modal field content for editing inline guests.
 */
router.get('/guest/modal/:id', function(req, res, next) {
    request({"uri":res.locals.apiUri.public.guests.base + req.params.id, "headers":{"x-access-token":req.session.authToken}}, function (err, data){
        if (err) { return next(err) }
        res.render('front/events/parts/guestFormModal', {
            user: req.user,
            data: JSON.parse(data.body).data
        })
    })
})

/**
 * I am the EDIT modal field content for editing inline pets.
 */
router.get('/pet/modal', function(req, res, next) {
    res.render('front/events/parts/petFormModal', {
        user: req.user,
        data: new Pet()
    })
})

/**
 * I am the EDIT modal field content for editing inline pets.
 */
router.get('/pet/modal/:id', function(req, res, next) {
    request({"uri":res.locals.apiUri.public.pets.base + req.params.id, "headers":{"x-access-token":req.session.authToken}}, function (err, data){
        if (err) { return next(err) }
        res.render('front/events/parts/petFormModal', {
            user: req.user,
            data: JSON.parse(data.body).data
        })
    })
})

// TODO Move to API
var getScheduleForDay = function (userInput, callback) {
    var start = moment(userInput.eventDay, 'x').startOf('day'),
        end = moment(userInput.eventDay, 'x').endOf('day'),
        query = { _event:userInput.eventId, startDateTime: { "$gte": start, "$lt": end }}
    async.parallel({
        Activities: function(cb) {
            Activity.find(query)
                .select("_contact name description startDateTime duration")
                .populate("_contact")
                .exec(cb)
        },
        Tasks: function(cb) {
            modelAFind: Task.find(query)
                .select("_contact name description startDateTime duration")
                .populate("_contact")
                .exec(cb)
        },
        Meals: function(cb) {
            Meal.find(query)
                .select("_contact name description startDateTime duration")
                .populate("_contact")
                .exec(cb)
        }
    }, function(err, result) {
        var activities = []
        var tasks = []
        var meals = []
        for (var i in result.Activities) {
            var obj = JSON.stringify(result.Activities[i])
            var obj2 = JSON.parse(obj)
            obj2.activity = 'activity'
            activities.push(obj2)
        }
        for (var i in result.Tasks) {
            var obj = JSON.stringify(result.Tasks[i])
            var obj2 = JSON.parse(obj)
            obj2.activity = 'task'
            tasks.push(obj2)
        }
        for (var i in result.Meals) {
            var obj = JSON.stringify(result.Meals[i])
            var obj2 = JSON.parse(obj)
            obj2.activity = 'meal'
            meals.push(obj2)
        }
        var ret = activities.concat(tasks, meals)
        // sort by time
        // ret.sort(dynamicSort("-startDateTime"));
        ret.sortBy(function(o){ return o.startDateTime });
        callback(err, ret);
  })
}

// Event Day Part
router.get('/eventDay/:eventId/:reservationId/:eventDay', function(req, res, next) {
    getScheduleForDay({ eventId: req.params.eventId, eventDay: req.params.eventDay }, function(err, data) {
        if (err) console.error(err)
        res.render("front/events/parts/eventDay", {
            user: req.user,
            reservationId: req.params.reservationId,
            data: data,
            moment: moment
        })
    })
})

module.exports = router
