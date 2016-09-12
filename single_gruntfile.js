// "use strict";
// var ngrok = require('grunt-ngrok');
// var ngrok = require('ngrok');

module.exports = function(grunt) {

  // load tasks!
  require('load-grunt-tasks')(grunt);

  // configure tasks!
  grunt.initConfig({
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['src/css/*.css', "<%= postcss.dist.dest %>"]
      }
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

    jshint: {
      options: {
        force: true,
        reporterOutput: "build/report.js"
      },
      all: ['gruntfile.js', 'grunt_tasks/*.js', 'src/js/*.js']
    },

    respimg: {
      options: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['./**.{gif,jpg,png,svg}'],
          dest: 'build/img/'
        }]
      }
    },

    pagespeed: {
      options: {
        nokey: true,
        url: "http://localhost:8000/",
        strategy: "desktop",
        locale: "en_GB"
      }
    },

    watch: {
      scripts: {

        csslint: {
          files: ['src/css/*.css'],
          tasks: ['csslint', 'postcss', 'csslint'],
          options: {
            livereload: 8000
          }
        },
        jshint: {
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
        },
        respimg: {
          files: ['src/img/*.{svg,jpg,jpeg,png}'],
          tasks: ['respimg'],
          options: {
            reload: true
          }
        },
        pagespeed: {
          files: ['index.html'],
          tasks: ['pagespeed'],
          options: {
            livereload: 8000
          }
        }

      }
    }


  });

  //
  // grunt.event.on('watch', function(action, filepath, target) {
  //   grunt.log.writeIn(target + ':' + filepath + ' has ' + action);
  // });

  // register tasks for running!

  grunt.registerTask('default', [
    'csslint', 'postcss', 'jshint', 'pagespeed', 'watch'
  ]);

};

//TODO add in uglify and concat
