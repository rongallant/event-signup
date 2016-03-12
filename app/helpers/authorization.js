var jwt = require('jsonwebtoken')
var exports = module.exports = {}

exports.pageIsAuthenticated = function(req, res, next) {
    console.log('\nSTART pageIsAuthenticated')
    if (req.isAuthenticated()) {
        console.info("200 : Authorized to access " + req.path)
        return next()
    }
    console.info("401 : Not Authorized to access " + req.path)
    var err = new Error('Not Authorized to access ' + req.path)
    err.statusCode = 401
    return next(err)
}

// Authenticate Token
exports.apiIsAuthenticated = function(req, res, next) {

    console.log('\nSTART apiIsAuthenticated')
    console.log('x-access-token = ' + req.headers['x-access-token'])
    console.log('req.body.token = ' + req.body.token)
    console.log('req.query.token = ' + req.query.token)

    var token = req.body.token || req.query.token || req.headers['x-access-token']
    if (token) {
        console.log('Verify Token')
        jwt.verify(token, req.app.get('authToken'), function(err, decoded) {
            if (err) {
                console.info("401 : Failed to authenticate token.  " + req.originalUrl)
                console.error(err)
                res.status(401).json({ "status": 401, "message": "Failed to authenticate token.", "error" : JSON.stringify(err) })
            } else {
                req.decoded = decoded
                console.info("200 : Authorized to access " + req.originalUrl)
                console.log('decoded')
                console.log(decoded)
                return next()
            }
        })
    } else {
        console.error('403: No token provided.')
        res.status(403).json({ "status": "403", "message": "No token provided." })
    }
}

exports.apiRequestErrorHandler = function(req, res, data, next) {
    // console.log('\nSTART apiRequestErrorHandler')
    // console.log('res.url = ' + res.url)
    // console.log('req.originalUrl = ' + req.originalUrl)
    // console.log('res.statusCode = ' + res.statusCode)
    // console.log('res.statusMessage = ' + res.statusMessage)
    // console.log('res.headersSent: ' + res.headersSent)
    // console.log('Ajax Request: ' + req.xhr)
    // console.log('data.body = ' + data.body)
    // console.log('req.session.authToken = ' + req.session.authToken)

    // // res.statusCode = JSON.parse(data.body).status
    // // res.statusMessage = JSON.parse(data.body).message

    // // Convert JSON error to NodeJS error.
    // if (res.statusCode > 399) {
    //     var err = new Error(res.statusMessage)
    //     err.statusCode = res.statusCode
    //     return next(err)
    // }
    // return next()
}
