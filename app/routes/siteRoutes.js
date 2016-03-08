/************************************************************
 * Front
 ***********************************************************/

module.exports = function(app) {

    var index = require('./front/index'),
        account = require('./front/account'),
        events = require('./front/events'),
        guests = require('./front/guests'),
        apiAccountPublic = require('./public_api/account')

    // Public Site Routes
    app.use('/', index)
    app.use('/account', account)
    app.use('/public_api/account', apiAccountPublic)
    app.use('/guest', guests)
    app.use('/events', events)
}