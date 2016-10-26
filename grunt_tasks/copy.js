module.exports = function(grunt) {
  grunt.config.merge({

    copy: {

      images: {
        files: [{
          expand: true,
          cwd: 'src/img/current/',
          src: ['sketch.jpg', 'transparent textures/*'],
          dest: 'build/img/'
        }]
      }

      // css: {
      //   files: [{
      //     expand: true,
      //     cwd: 'build/css/',
      //     src: ['sass-style.css'],
      //     dest: 'build/css/actual/'
      //   }]
      // }


    },
	});
};