module.exports = function(grunt) {
  grunt.config.merge({

    jshint: {
      options: {
        force: true,
        reporterOutput: "build/report.js"
      },
      all: ['gruntfile.js', 'grunt_tasks/*.js', 'src/js/*.js']
    },

    watch: {
      scripts: {
        files: ['gruntfile.js', './grunt_tasks/*.js', 'src/js/*.js'],
        tasks: ['jshint'],
        options: {
          event: 'changed',
          reload: true, // reload Watch
          forever: false,
          dateFormat: function(time) {
            grunt.log.writeIn('Watch took', time, 'ms to complete!');
            grunt.log.writeIn('Now waiting for more changes...');
          },
          livereload: 8000
        }
      }
    }

  });
};
