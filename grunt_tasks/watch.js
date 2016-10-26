module.exports = function(grunt) {
  grunt.config.merge({

    watch: {
      options: {
        spawn: false,
        livereload: true
      },

      // scripts: {
        javascript: {
          files: ['gruntfile.js', './grunt_tasks/*.js', 'src/js/*.js'],
          tasks: ['jshint'],
          options: {
            forever: false,
            dateFormat: function(time) {
              grunt.log.writeIn('Watch took', time, 'ms to complete!');
              grunt.log.writeIn('Now waiting for more changes...');
            }
          }
        },
        html: {
          files: 'index.html',
          tasks: ['watch']
        },
        scss: {
          files: ['src/css/*.scss'],
          tasks: ['sass', 'postcss']
        },
        csslint: {
          files: "<%= postcss.dist.dest %>",
          tasks: ['csslint']
        },
        images: {
          files: ['src/img/*.{svg,jpg,jpeg,png}', 'src/img/**/*.{svg,jpg,jpeg,png}'],
          tasks: ['responsive-images']
        }
        // pagespeed: {
        //   files: ['index.html'],
        //   tasks: ['pagespeed']
        // },

    }
  });
};