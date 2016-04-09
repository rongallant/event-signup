var path = require("path")
module.exports = {
  // TODO replace this with appUrls.js
  appPaths: function (req, res, appDesc) {
    var API_ITEM = path.join('/api', appDesc['apiSingle'] + path.sep)
    var API_COLLECTION = path.join('/api', appDesc['apiCollection'] + path.sep)
    var APP_FOLDER = path.join('/admin', appDesc['folder'])
    var APP_VIEW_FOLDER = path.join('admin', appDesc['folder'])
    res.locals.fullUrl = 'https://' + req.get('host')
    res.locals.apiItem = res.locals.fullUrl + API_ITEM
    res.locals.apiCollection = res.locals.fullUrl + API_COLLECTION

    // App URLS
    res.locals.listAction = APP_FOLDER // Base folder
    res.locals.readOnlyAction = path.join(APP_FOLDER, 'view/')
    res.locals.editAction = path.join(APP_FOLDER, 'edit/')
    res.locals.createAction = path.join(APP_FOLDER, 'create/')
    res.locals.deleteAction = path.join(APP_FOLDER, 'delete/')

    // JADE View Templates
    res.locals.listView = path.join(APP_VIEW_FOLDER, 'list')
    res.locals.editView = path.join(APP_VIEW_FOLDER, 'edit')
    res.locals.readOnlyView = path.join(APP_VIEW_FOLDER, 'view')
  }
}