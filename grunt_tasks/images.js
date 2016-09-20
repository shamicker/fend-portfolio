module.exports = function(grunt) {
  grunt.config.merge({

    responsive-images: {
      options: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['./**.{gif,jpg,png,svg}'],
          dest: 'build/img/'
        }]
      }
    },

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
