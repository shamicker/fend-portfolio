"use strict"
var ngrok = require('ngrok');

module.exports = function(grunt) {

  // load tasks!
  require('load-grunt-tasks')(grunt);

  // configure tasks!
  require('./grunt_tasks/css.js')(grunt);
  require('./grunt_tasks/javascript.js')(grunt);
  require('./grunt_tasks/images.js')(grunt);
  require('./grunt_tasks/pagespeed.js')(grunt);

  //
  // grunt.event.on('watch', function(action, filepath, target) {
  //   grunt.log.writeIn(target + ':' + filepath + ' has ' + action);
  // });

  // register tasks for running!
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 9292;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  grunt.registerTask('default', [
    'csslint', 'postcss', 'jshint', 'psi-ngrok', 'watch'
  ]);

};

//TODO add in uglify and concat
