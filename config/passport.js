
/************************************************************
 * Passport Security
 ***********************************************************/

var Person = require("../app/models/person")

module.exports = function(app, passport) {
    // Configuring Passport
    app.use(passport.initialize())
    app.use(passport.session())

    // use static authenticate method of model in LocalStrategy
    passport.use(Person.createStrategy())

    // use static serialize and deserialize of model for passport session support
    passport.serializeUser(Person.serializeUser())
    passport.deserializeUser(Person.deserializeUser())
}