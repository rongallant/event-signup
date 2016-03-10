var jwt = require('jsonwebtoken')
var exports = module.exports = {}

exports.pageIsAuthenticated = function(req, res, next) {
    console.log('\nSTART pageIsAuthenticated')
    console.log('req.user = ' + req.user)
    if (req.isAuthenticated()) {
        console.info("200 : Authorized to access " + req.path)
        return next()
    }
    console.info("401 : Not Authorized to access " + req.path)
    var err = new Error('Not Authorized to access ' + req.path)
    err.status = 401
    return next(err)
}

// Authenticate Token
exports.apiIsAuthenticated = function(req, res, next) {

    // console.log('\nSTART app.user api validation')
    // console.log('x-access-token = ' + req.headers['x-access-token'])
    // console.log('req.body.token = ' + req.body.token)
    // console.log('req.query.token = ' + req.query.token)
    // console.log('Verify Token')
    // var token = req.body.token || req.query.token || req.headers['x-access-token']
    // console.log('NEEDED userToken = ' + token)

    // if (token) {
    //     console.log("authToken = " + req.app.get('authToken'))
    //     jwt.verify(token, req.app.get('authToken'), function(err, decoded) {
    //         if (err) {
    //             console.log(err)
    //             console.info("401 : Failed to authenticate token.  " + req.path)
    //             return res.status(401).json({ "status": 401, "message": "Failed to authenticate token.", "error" : JSON.stringify(err) })
    //         } else {
    //             req.decoded = decoded
    //             console.info("200 : Authorized to access " + req.path)
    //             // console.log('\END apiIsAuthenticated\n')
                return next()
    //         }
    //     })
    // } else {
    //     console.error('403: No token provided.')
    //     return res.status(403).json({ "status": "403", "message": "No token provided." })
    // }
}

exports.apiRequestErrorHandler = function(req, res, data, next) {

    console.log('\nSTART apiRequestErrorHandler')
    // console.log('res.url = ' + res.url)
    // console.log('res.statusCode = ' + res.statusCode)
    // console.log('res.statusMessage = ' + res.statusMessage)
    // console.log('res.headersSent: ' + res.headersSent)
    // console.log('Ajax Request: ' + req.xhr)
    // console.log('data.body = ' + data.body)
    // console.log('req.session.authToken = ' + req.session.authToken)

    res.body = data.body
    res.statusCode = JSON.parse(data.body).status
    res.statusMessage = JSON.parse(data.body).message

    // console.log('res.statusMessage = ' + res.statusMessage)
    // console.log('res.headersSent: ' + res.headersSent)
    // console.log('END apiRequestErrorHandler\n')

    // covert JSON error to NodeJS error.
    if (res.statusCode > 399) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return next(err)
    } else {
        return next()
    }
}
