module.exports = function(grunt) {
  grunt.config.merge({

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

    watch: {
      scripts: {
        files: ['src/img/*.{svg,jpg,jpeg,png}'],
        tasks: ['respimg'],
        options: {
          reload: true
        }
      }
    }

  });
};
