module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        ts: {
            server: {
                tsconfig: './tsconfig.json'
            }
        },
        watch: {
            tsserver: {
                files: 'server/**/*.ts',
                tasks: ['ts:server']
            }
        }
    });
    grunt.registerTask('build_dev', ["ts:server"]);
    grunt.registerTask('default', ['build_dev', 'watch']);
};