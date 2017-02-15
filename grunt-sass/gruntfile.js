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
 			sourceMap: {
				options: {
					sourceMap: '../Resources/Public/Styles/phlu.css.map'
				}
			}
		}
	});


	grunt.registerTask('default', ['sass','watch']);

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');



};
