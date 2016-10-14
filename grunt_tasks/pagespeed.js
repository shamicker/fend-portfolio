// Images and pagespeed

module.exports = function(grunt) {
  grunt.config.merge({

    pagespeed: {
      options: {
        nokey: true,
        url: "http://0.0.0.0:8000/"
      },
      local: {
        url: "http://0.0.0.0:8000/",
        strategy: "desktop",
        locale: "en_GB",
        threshold: 40
      },
      mobile: {
        strategy: "mobile",
        locale: "en_GB"
      }
    },

    connect: {
      // uses_defaults: {}
      server: {
        options: {
          port: 8000,
          // base: 'public',
          // locale: en_GB,
          threshold: 70,
          livereload: true
          // base: '0.0.0.0'
        }
      }
    },

    watch: {
      scripts: {
        files: ['index.html'],
        tasks: ['pagespeed'],
        options: {
          livereload: 8000
        }
      }
    }

  });
};
