var exports = module.exports = {}

exports.hasRole = function(userRoles, allowedRoles) {
    for (var i = 0, len = userRoles.length; i < len; i++) {
        if (allowedRoles.indexOf(userRoles[i].toUpperCase()) >= 0) {
            return true
        }
    }
    return false
}

exports.isUser = function(userRoles) {
    return this.hasRole(userRoles, ["USER","ADMIN"])
}

exports.isAdmin = function(userRoles) {
    return this.hasRole(userRoles, ["ADMIN"])
}

exports.needsRole = function(allowedRoles) {
    return [
        function(req, res, next) {
            if (!Array.isArray(allowedRoles)) allowedRoles = [allowedRoles]
            if (exports.hasRole(req.user.roles, allowedRoles)) {
                return next();
            } else {
                console.error("401 : Does not have privileges. " + req.originalUrl)
                res.status(401).json( {"status": "401", "message": "Does not have privileges." })
            }
        }
    ]
}
