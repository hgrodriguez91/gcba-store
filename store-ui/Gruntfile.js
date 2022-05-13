module.exports = function(grunt) {
    var _ = require('underscore');
    var devConf,
        confData,
        targetDir;

    confData = grunt.file.readJSON('default.conf.json');
    if (grunt.file.exists('dev.conf.json')) {
        confData = _.extend(confData, grunt.file.readJSON('dev.conf.json'));
    }

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, confData);
    grunt.registerTask('default', ['all']);
};