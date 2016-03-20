
/************************************************************
 * Passport Security
 ***********************************************************/

var Account = require("../app/models/account")

module.exports = function(app, passport) {
    // Configuring Passport
    app.use(passport.initialize())
    app.use(passport.session())

    // use static authenticate method of model in LocalStrategy
    passport.use(Account.createStrategy())

    // use static serialize and deserialize of model for passport session support

    passport.serializeUser(function(user, done) {
        done(null, user._id)
    })
    
    passport.deserializeUser(function(id, done) {
        Account.findById(id, 'username roles _person', function(err, user) {
            done(err, user)
        })
    })
}