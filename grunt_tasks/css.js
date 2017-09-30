module.exports = function(grunt) {
  grunt.config.merge({

    sass: {
      dist: {
        // src: 'src/css/sass-style.scss',
        src: 'src/css/sticky.scss',
        // dest: 'build/css/sass-style.css'
        dest: 'build/css/sticky.css'
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 2 versions']})
        ],
        // map: true
        // failOnError: true
      },
      dist: {
        src: 'build/css/sticky.css',
        dest: 'build/css/output.css'
      }
    },

    csslint: {
      options: {
        csslintrc: 'src/css/.csslintrc'
        // quiet: true
        // gradients: 2
      },
      // src: ['src/css/main.css']
      files: {
        src: 'build/css/output.css'
      }
    }

  });
};

