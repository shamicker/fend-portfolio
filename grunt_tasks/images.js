module.exports = function(grunt) {
  grunt.config.merge({

    responsive_images: {
      IPND: {
        options: {
          sizes: [
            {
              width: 640,
              height: 360,
              // quality: 40,
              aspectRatio: false,
              gravity: "Northwest"
            },{
              width: 960,
              height: 540,
              // quality: 90,
              aspectRatio: false,
              gravity: "Northwest"
            },{
              width: 1200,
              height: 600,
              // quality: 100,
              aspectRatio: false,
              gravity: "Northwest"
            }
          ]
        },
        files: [{
          expand: true,
          cwd: 'src/img/current',
          src: ['./IPND_*.{jpg,png}'],
          dest: 'build/img/responsives'
        }]
      },
      
    },

    // gm_picturefill: {
    //   // logo
    //   task_one: {
    //     options: [{
    //
    //     }],
    //     files: {
    //       src: "src/img/hipster_logo.png",
    //       dest: "build/img/logo.png"
    //     }
    //   },
    //
    //   // project-img
    //   task_two: {
    //     options: {
    //       picturefill: [
    //         {
    //           breakpoint: '320px',
    //           prefix: 'xs',
    //           size: {
    //             width: 320,
    //             height: 320
    //           },
    //           quality: 30
    //         }, {
    //           breakpoint: '640px',
    //           prefix: 'small',
    //           size: {
    //             width: 640,
    //             height: 640
    //           },
    //           quality: 50
    //         },{
    //           breakpoint: '960px',
    //           prefix: 'med',
    //           size: {
    //             width: 960,
    //             height: 960
    //           },
    //           quality: 90
    //         },{
    //           breakpoint: '1080px',
    //           prefix: 'lg',
    //           size: {
    //             width: 1080,
    //             height: 1080
    //           },
    //           quality: 100
    //         }
    //       ]
    //     },
    //     files: {
    //       src: "src/img/*.{png,jpg}",
    //       dest: "build/img/"
    //     }
    //   }
    // },

    watch: {
      scripts: {
      files: ['src/img/*.{svg,jpg,jpeg,png}'],
      tasks: ['responsive-images'],
      options: {
        reload: true
      }
      }
    }

  });
};
