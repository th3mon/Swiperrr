/* global module */
module.exports = function( grunt ) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            basic: {
                src: [
                    'src/Swiperrr.js'
                ],
    
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },

        concat: {
            basic: {
                options: {
                    process: function(src, filepath) {
                        var
                            addFilePath = function(src) {
                                return '//! ' + filepath + '\n' + src;
                            };

                        return addFilePath(src);
                    }
                },

                files: {
                    'swiperrr.js': [
                        'libs/function.prototype.bind.pllyfill.js',
                        'libs/iscroll.js',
                        'src/Swiperrr.js'
                    ]
                }
            }
        },
        watch: {
            basic: {
                files: [
                    'Swiperrr.js'
                ],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask( 'default', [ 'jshint:basic', 'concat:basic' ] );
    grunt.registerTask( 'deploy', [ 'concat:basic' ] );
};