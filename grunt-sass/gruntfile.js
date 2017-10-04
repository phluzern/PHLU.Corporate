'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['../Resources/Private/SASS/phlu.scss'],
                tasks: ['sass','concat']
            },
            js: {
                files: ['../Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/*','../Resources/Public/JavaScript/jquery/*.js','../../../Application/Neoslive.Hybridsearch/Resources/Public/hybridsearch.js'],
                tasks: ['concat','uglify']
            }
        },
        sass: {
            compile: {
                files: {
                    '../Resources/Public/Styles/phlu.css': '../Resources/Private/SASS/phlu.scss'
                }
            },
            options: {
                sourceMap: true
            },
            sourceMap: {
                options: {
                    sourceMap: '../Resources/Public/Styles/phlu.css.map'
                }
            }
        },
        concat: {
            js: {
                src: [
                    // header
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angularjs/angular.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angular-cookies/angular-cookies.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/firebase/firebase.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/angular-sanitize/angular-sanitize.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/elasticlunr.js/elasticlunr.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/jquery/dist/jquery.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/iframe-resizer/js/iframeResizer.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angular-animate/angular-animate.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angular-aria/angular-aria.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angular-material/angular-material.min.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/algoliasearch/dist/algoliasearch.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/hybridsearch.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/app.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/SubjectsFilterNavCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/ContactsCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/SearchCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/PpdbCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/EventoCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/LocationCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/LogCtrl.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/NewsCtrl.js',
                    // footer
                    '../../../Sites/Phlu.Corporate/Resources/Public/blueimp/js/blueimp-gallery.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/jquery/jquery.mobile.custom.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/grunt-modernizr/lib/build-files/modernizr-latest.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/tether/dist/js/tether.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/bootstrap/dist/js/bootstrap.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/bootstrap-datepicker/dist/locales/bootstrap-datepicker.de.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/jquery-rcrumbs/dist/jquery.rcrumbs.min.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/jquery/main.js'
                ],
                dest: '../Resources/Public/JavaScript/application.js'
            },
            css: {
                src: [
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/jquery-rcrumbs/dist/jquery.rcrumbs.min.css',
                    '../../../Sites/Phlu.Corporate/Resources/Public/blueimp/css/blueimp-gallery.min.css',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Styles/phlu.css',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/animate.css/animate.css'

                ],
                dest: '../Resources/Public/Styles/phlu-all.css'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                mangleProperties: true
            },
            js: {
                src: '../Resources/Public/JavaScript/application.js',
                dest: '../Resources/Public/JavaScript/application.min.js',
                nonull: true
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ['../Resources/Public/Styles/phlu-all.css'],
                    dest: '.',
                    ext: '.min.css'
                }]
            }
        }

    });

// Load the plugin that provides the "concat" task.


    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['sass', 'concat', 'uglify', 'cssmin','watch']);


};
