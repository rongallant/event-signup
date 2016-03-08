var exports = module.exports = {}

exports.pageIsAuthenticated = function(req, res, next) {
    console.log('\nSTART pageIsAuthenticated')
    console.log('req.session.authToken = ' + req.session.authToken)
    console.log('pageIsAuthenticated: ' + req.path)
    if (req.isAuthenticated()) {
        console.info("200 : Authorized to access " + req.path)
        return next()
    }
    var err = new Error('Not Authorized to access ' + req.path)
    err.status = 401
    console.log('\nEND pageIsAuthenticated')
    return next(err)
}

exports.apiIsAuthenticated = function(req, res, next) {

    console.log('\nSTART apiIsAuthenticated')
    console.log('req.session.authToken = ' + req.session.authToken)
    if (req.isAuthenticated()) {
        console.info("200 : Authorized to access " + req.path)
        console.log('\END apiIsAuthenticated\n')
        return next()
    } else {
        console.info("401 : Not Authorized to access " + req.path)
        console.log('\END apiIsAuthenticated\n')
        return res.status(401).json({ "status" : "401", "message" : "Not Authorized to access " + req.path })
    }
}

exports.apiRequestErrorHandler = function(req, res, data, next) {

    console.log('\nSTART apiRequestErrorHandler')
    console.log('res.url = ' + res.url)
    console.log('res.statusCode = ' + res.statusCode)
    console.log('res.statusMessage = ' + res.statusMessage)
    console.log('res.headersSent: ' + res.headersSent)
    console.log('Ajax Request: ' + req.xhr)
    console.log('data.body = ' + data.body)
    console.log('req.session.authToken = ' + req.session.authToken)

    res.body = data.body
    res.statusCode = JSON.parse(data.body).status
    res.statusMessage = JSON.parse(data.body).message

    console.log('res.statusMessage = ' + res.statusMessage)
    console.log('res.headersSent: ' + res.headersSent)
    console.log('END apiRequestErrorHandler\n')

    // covert JSON error to NodeJS error.
    if (res.statusCode > 399) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return next(err)
    } else {
        return next()
    }
}
