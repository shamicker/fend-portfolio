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

      logo: {
        options: {
          sizes: [{
            width: 250,
            height: 200
          }]
        },
        files: [{
          expand: true,
          cwd: 'src/img/current',
          src: ['hipster_logo.png'],
          dest: 'build/img/'
        }]
      }

    }


  });
};
