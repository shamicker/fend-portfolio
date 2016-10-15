"use strict";
var psiNgrok = require('psi-ngrok');
// psiNgrok();

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
  // grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
  //   var done = this.async();
  //   var port = 8000;

  //   ngrok.connect(port, function(err, url) {
  //     if (err !== null) {
  //       grunt.fail.fatal(err);
  //       return done();
  //     }
  //     grunt.config.set('pagespeed.options.url', url);
  //     grunt.task.run('pagespeed');
  //     done();
  //   });
  // });
  grunt.registerTask('pagespeed', function() {
    var async = this.async;

    grunt.event.once('connect.server.listening', function(host, port){
      psiNgrok({
        port: 8000,
        pages: ['index.html'],
        onError: function(error) {
          grunt.fatal(error);
        },
        options: {
          threshold: 80
        }
      }).then(async());
    });
  });

  // grunt.registerTask('psi_only', ['pagespeed', 'connect:server:keepalive']);

  grunt.registerTask('default', [
    'postcss',
    'csslint',
    'jshint',
    'responsive_images',
    'connect'
  ]);
};

//  TODO : add in uglify and concat
