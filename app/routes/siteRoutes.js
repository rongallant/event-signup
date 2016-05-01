/************************************************************
 * Front
 ***********************************************************/

module.exports = function(app) {

    var index = require('./front/index'),
        account = require('./front/account'),
        events = require('./front/events'),
        guests = require('./front/guests'),
        apiAccountPublic = require('./public_api/account'),
        apiGuestsPublic = require('./public_api/guests'),
        apiPetsPublic = require('./public_api/pets')

    // Public Site Routes
    app.use('/', index)
    app.use('/account', account)
    app.use('/guest', guests)
    app.use('/events', events)

    // Public API Routes
    app.use('/public_api/account', apiAccountPublic)
    app.use('/public_api/guests', apiGuestsPublic)
    app.use('/public_api/pets', apiPetsPublic)

}