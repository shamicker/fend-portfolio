
[1m   ../gruntfile.js[22m
      1 |[90m"use strict"[39m
                     ^ Missing semicolon.
[31m>> [39mUse the function form of "use strict".
      2 |[90mvar ngrok = require('ngrok');[39m
                     ^ 'require' is not defined.
      7 |[90m  require('load-grunt-tasks')(grunt);[39m
           ^ 'require' is not defined.
     10 |[90m  require('./grunt_tasks/css.js')(grunt);[39m
           ^ 'require' is not defined.
     11 |[90m  require('./grunt_tasks/javascript.js')(grunt);[39m
           ^ 'require' is not defined.
     12 |[90m  require('./grunt_tasks/images.js')(grunt);[39m
           ^ 'require' is not defined.
     13 |[90m  require('./grunt_tasks/pagespeed.js')(grunt);[39m
           ^ 'require' is not defined.
      4 |[90mmodule.exports = function(grunt) {[39m
         ^ 'module' is not defined.

[31m>> [39m9 errors in 5 files
