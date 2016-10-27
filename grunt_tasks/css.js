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
      files: {
        src: ["<%= postcss.dist.dest %>"]
      }
    },

    postcss: {
      options: {
        processors: [require('autoprefixer')({browsers: 'last 2 versions'})]
        // failOnError: true
      },
      dist: {
        src: ["<%= sass.dist.dest %>"],
        dest: 'build/css/output.css'
      }
    }

  });
};

