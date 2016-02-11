var path = require("path")

module.exports = {
  appPaths: function (req, res, appUrl) {
    var API_FOLDER = path.join('/api', appUrl + path.sep)
    var APP_FOLDER = path.join('/admin', appUrl)
    var APP_VIEW_FOLDER = path.join('admin', appUrl)
    res.locals.fullUrl = 'https://' + req.get('host')
    res.locals.apiAction = res.locals.fullUrl + API_FOLDER
    res.locals.listAction = APP_FOLDER
    res.locals.editAction = path.join(APP_FOLDER, 'edit/')
    res.locals.createAction = path.join(APP_FOLDER, 'create/')
    res.locals.deleteAction = path.join(APP_FOLDER, 'delete')
    res.locals.listView = path.join(APP_VIEW_FOLDER, 'list')
    res.locals.editView = path.join(APP_VIEW_FOLDER, 'edit')

    console.info('appPaths')
    console.table(res.locals)
  }
}