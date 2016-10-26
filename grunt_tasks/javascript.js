module.exports = function(grunt) {
  grunt.config.merge({

    jshint: {
      options: {
        globals: {
          "require": false,
          "module": false
        },
        force: true,
        reporterOutput: "build/report.js"
      },
      all: ['gruntfile.js', 'grunt_tasks/*.js', 'src/js/app.js', 'src/js/header.js']
    }

  });
};
