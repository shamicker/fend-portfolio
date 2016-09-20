// Images and pagespeed

module.exports = function(grunt) {
  grunt.config.merge({

    gm_picturefill: {
      task_one: {
        options: {
          picturefill: [
            {
              breakpoint: '320px',
              prefix: 'xs',
              size: {
                width: 320,
                height: 320
              },
              quality: 100
            },{
              etc
            }]
        },
        files: {
          src:
          dest:
        }
      }
    }

    pagespeed: {
      options: {
        nokey: true,
        // url: "http://localhost:8000/",
      },
      local: {
        // url: "http://localhost:8000/",
        strategy: "desktop",
        locale: "en_GB",
        threshold: 40
      },
      mobile: {
        strategy: "mobile",
        locale: "en_GB"
      }
    },


    watch: {
      scripts: {
        files: ['index.html'],
        tasks: ['pagespeed'],
        options: {
          livereload: 9292
        }
      }
    }

  });
};
