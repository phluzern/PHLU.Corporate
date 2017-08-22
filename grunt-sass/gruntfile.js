'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['../Resources/Private/SASS/phlu.scss'],
                tasks: ['sass']
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
            jshead: {
                src: [
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angularjs/angular.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/angular-cookies/angular-cookies.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/firebase/firebase.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/angular-sanitize/angular-sanitize.js',
                    '../../../Application/Neoslive.Hybridsearch/Resources/Public/Vendor/elasticlunr.js/elasticlunr.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/jquery/dist/jquery.js',
                    '../../../Sites/Phlu.Corporate/Resources/Public/Vendor/iframe-resizer/js/iframeResizer.js',
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
                    '../../../Sites/Phlu.Corporate/Resources/Public/JavaScript/angularjs/Phlu/Corporate/Controller/NewsCtrl.js'
                ],
                dest: '../Resources/Public/JavaScript/jsHead.js'
            },
            jsbody: {
                src: [
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
                dest: '../Resources/Public/JavaScript/jsBody.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            jshead: {
                src: '../Resources/Public/JavaScript/jsHead.js',
                dest: '../Resources/Public/JavaScript/jsHead.min.js',
                nonull: true
            },
            jsbody: {
                src: '../Resources/Public/JavaScript/jsBody.js',
                dest: '../Resources/Public/JavaScript/jsBody.min.js',
                nonull: true
            }
        }
    });

// Load the plugin that provides the "concat" task.



    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'watch']);


};
