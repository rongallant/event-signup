
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
Account
    // use static serialize and deserialize of model for passport session support
    passport.serializeUser(Account.serializeUser())
    passport.deserializeUser(Account.deserializeUser())
}