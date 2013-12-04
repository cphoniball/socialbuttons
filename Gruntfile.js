module.exports = function(grunt) {

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	sass: {
	    dist: {
		files: {
		    'main.css': 'main.sass'
		}
	    }
	},
	watch: {
	    styles: {
		files: ['main.sass'],
		tasks: ['sass']
	    }
	}
    }); 

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']); 

};
