module.exports = function(grunt) {
  grunt.config.merge({

    csslint: {
      options: {
        quiet: true
      },
      src: ['src/css/*.css']
    },

    postcss: {
      options: {
        processors: [require('autoprefixer')({browsers: '> 1%'})]
        // failOnError: true
      },
      dist: {
        src: ['src/css/*.css'],
        dest: 'build/css/style.css'
      }
    },

    watch: {
      scripts: {
        files: ['src/css/*.css'],
        tasks: ['csslint', 'postcss', 'csslint'],
        options: {
          livereload: 8000
        }
      }
    }

  });
};
