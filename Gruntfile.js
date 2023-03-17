module.exports = function(grunt) {
    srcs: [ 'src/*.js' ],

    // 配置信息
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            logger: {
                src: 'src/logger.js',
                dest: 'dist/logger.min.js',
            },
            config: {
                src: 'src/user-script-config.js',
                dest: 'dist/user-script-config.min.js',
            },
            inject: {
                src: 'src/dynamic-inject.js',
                dest: 'dist/dynamic-inject.min.js',
            },
            commons: {
                src: [ 'src/*.js' ],
                dest: 'dist/commons.min.js'
            }
        }
    })

    // 加载uglify
    grunt.loadNpmTasks('grunt-contrib-uglify')

    // 默认执行任务
    grunt.registerTask('default', ['uglify'])


}