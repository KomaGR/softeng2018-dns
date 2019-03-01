module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.initConfig({
        ts: {
            server: {
                tsconfig: './tsconfig.json'
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: ['node_modules/bootstrap/scss/bootstrap.scss', 'client/pages/scss/*.scss'],
                    dest: 'client/pages/css/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            scss: {
                files: ['node_modules/bootstrap/scss/bootstrap.scss', 'client/pages/scss/*.scss'],
                tasks: ['sass']
            },
            tsserver: {
                files: 'server/**/*.ts',
                tasks: ['ts:server']
            }
        }
    });
    grunt.registerTask('build_dev', ["ts:server"]);
    grunt.registerTask('default', ['build_dev', 'watch:tsserver']);
};