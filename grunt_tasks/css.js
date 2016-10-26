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

    csslint: {
      options: {
        // quiet: true
        // gradients: 2
      },
      // src: ['src/css/main.css']
      dist: {
        first: {
          src: "<%= sass.dist.dest %>"
        },
        second: {
          src: "build/css/output.css"
        }
      }
    },

    postcss: {
      options: {
        processors: [require('autoprefixer')({browsers: '> 1%'})]
        // failOnError: true
      },
      dist: {
        src: ["<%= sass.dist.dest %>"],
        dest: 'build/css/output.css'
      }
    }

  });
};

