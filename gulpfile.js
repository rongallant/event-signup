var
  gulp  = require('gulp'),
  gulphelp  = require('gulp-help'),
  watch = require('./semantic/tasks/watch'),
  build = require('./semantic/tasks/build'),
  gutil = require('gulp-util')

// import task with a custom task name
gulp.task('watch ui', watch)
gulp.task('build ui', build)

// define the default task and add the watch task to it
gulp.task('default', ['watch'])

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});