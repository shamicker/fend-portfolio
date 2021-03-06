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
        css: {
          files: 'src/css/main.css',
          tasks: ['postcss', 'csslint']
        },
        scss: {
          files: ['src/css/*.scss'],
          tasks: ['sass', 'postcss']
        },
        csslint: {
          files: "<%= postcss.dist.dest %>",
          tasks: ['csslint','watch']
        },
        images: {
          files: ['src/img/**/*.{svg,jpg,jpeg,png}', 'build/img/**/*.{svg, jpg, jpeg, png}'],
          tasks: ['responsive-images', 'imageoptim']
        }
        // pagespeed: {
        //   files: ['index.html'],
        //   tasks: ['pagespeed']
        // },

    }
  });
};